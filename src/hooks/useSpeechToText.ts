
import { useState, useRef, useEffect, useCallback } from "react";
import { API_KEYS } from "@/config/env";

interface SpeechToTextProps {
  onTranscriptionComplete?: (text: string) => void;
  autoStopDelay?: number; // milliseconds of silence to auto-stop
}

export function useSpeechToText({
  onTranscriptionComplete,
  autoStopDelay = 1500, // Default 1.5 seconds of silence to auto-stop
}: SpeechToTextProps = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  
  // Clean up function for resources
  const cleanupResources = useCallback(() => {
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, []);
  
  // Process audio using Web Speech API
  const processAudioWithWebSpeech = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Use the type definitions from our declaration file
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        reject("Speech recognition not supported in this browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        reject(`Speech recognition error: ${event.error}`);
      };

      recognition.start();
    });
  }, []);
  
  // Process audio using AssemblyAI
  const processAudioWithAssemblyAI = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      // Convert Blob to base64
      const reader = new FileReader();
      const audioBase64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result?.toString().split(',')[1];
          resolve(base64 || '');
        };
      });
      reader.readAsDataURL(audioBlob);
      const audioBase64 = await audioBase64Promise;

      // Call AssemblyAI API
      const response = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: {
          "Authorization": API_KEYS.ASSEMBLY_AI_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio_data: audioBase64 })
      });

      if (!response.ok) {
        throw new Error(`AssemblyAI upload failed: ${response.statusText}`);
      }

      const { upload_url } = await response.json();

      // Start transcription
      const transcriptionResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
          "Authorization": API_KEYS.ASSEMBLY_AI_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio_url: upload_url })
      });

      if (!transcriptionResponse.ok) {
        throw new Error(`AssemblyAI transcription failed: ${transcriptionResponse.statusText}`);
      }

      const { id } = await transcriptionResponse.json();

      // Poll for results
      let transcriptData;
      let status = "processing";

      while (status === "processing" || status === "queued") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const checkResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
          headers: {
            "Authorization": API_KEYS.ASSEMBLY_AI_KEY,
          },
        });

        transcriptData = await checkResponse.json();
        status = transcriptData.status;
      }

      if (status === "completed") {
        return transcriptData.text || "";
      } else {
        throw new Error(`Transcription failed with status: ${status}`);
      }
    } catch (error) {
      console.error("AssemblyAI processing error:", error);
      throw error;
    }
  }, []);

  // Process audio using both methods with fallbacks
  const processAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      try {
        // First try Web Speech API (faster and free)
        return await processAudioWithWebSpeech();
      } catch (error) {
        console.log("Web Speech API failed, falling back to AssemblyAI", error);
        // Fall back to AssemblyAI
        return await processAudioWithAssemblyAI(audioBlob);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process audio: ${error.message}`);
      }
      throw new Error("Unknown error processing audio");
    }
  }, [processAudioWithWebSpeech, processAudioWithAssemblyAI]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setIsRecording(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up auto-stop detection based on silence
      const resetSilenceTimeout = () => {
        if (silenceTimeoutRef.current) {
          window.clearTimeout(silenceTimeoutRef.current);
        }
        
        silenceTimeoutRef.current = window.setTimeout(() => {
          if (isRecording) {
            stopRecording();
          }
        }, autoStopDelay);
      };

      // Detect audio levels to reset silence timeout
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 512;
      analyzer.smoothingTimeConstant = 0.4;
      source.connect(analyzer);
      
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const checkAudioLevel = () => {
        if (!isRecording || !mediaRecorderRef.current) return;
        
        analyzer.getByteFrequencyData(dataArray);
        
        // Calculate average frequency intensity
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // If sound is detected, reset the silence timeout
        if (average > 5) {
          resetSilenceTimeout();
        }
        
        // Continue checking if still recording
        if (isRecording) {
          requestAnimationFrame(checkAudioLevel);
        }
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        audioContext.close();
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const text = await processAudio(audioBlob);
          
          setTranscribedText(text);
          if (onTranscriptionComplete) {
            onTranscriptionComplete(text);
          }
        } catch (err) {
          console.error('Error processing audio:', err);
          setError(err instanceof Error ? err.message : 'Unknown error processing audio');
        } finally {
          setIsProcessing(false);
          setIsRecording(false);
        }
      };

      // Start recording and monitoring
      mediaRecorder.start();
      resetSilenceTimeout();
      requestAnimationFrame(checkAudioLevel);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(err instanceof Error ? 
        err.message === 'Permission denied' ? 'Microphone permission denied. Please allow access.' : err.message
        : 'Failed to access microphone');
      setIsRecording(false);
    }
  }, [isRecording, autoStopDelay, processAudio, onTranscriptionComplete]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  return {
    isRecording,
    isProcessing,
    transcribedText,
    error,
    startRecording,
    stopRecording
  };
}

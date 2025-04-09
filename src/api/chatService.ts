
import { API_KEYS, API_ENDPOINTS } from "@/config/env";
import type { Message } from "@/components/ChatHistory";

// Types for API responses
type TogetherAPIResponse = {
  choices: [{
    message: {
      content: string;
    }
  }]
};

type HuggingFaceAPIResponse = {
  generated_text: string;
};

type OpenRouterResponse = {
  choices: [{
    message: {
      content: string;
    }
  }]
};

// Main service functions
export const chatService = {
  // Call primary AI service (Hugging Face)
  callPrimaryAI: async (content: string, previousMessages: Message[]): Promise<string> => {
    const conversation = previousMessages.map(msg => ({
      role: msg.isAI ? "assistant" : "user",
      content: msg.content
    }));
    
    const payload = {
      inputs: {
        system: "You are Lucky, a helpful and friendly AI assistant. Respond to users in a conversational, natural way. Keep responses concise but informative.",
        messages: [
          ...conversation,
          { role: "user", content }
        ]
      },
      parameters: {
        temperature: 0.7,
        max_new_tokens: 800
      }
    };
    
    const response = await fetch(API_ENDPOINTS.HF_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEYS.HF_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Hugging Face API error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json() as HuggingFaceAPIResponse;
    return data.generated_text || "I'm sorry, I couldn't generate a response.";
  },

  // Call fallback AI service (Together.ai)
  callFallbackAI: async (content: string, previousMessages: Message[]): Promise<string> => {
    const response = await fetch(API_ENDPOINTS.TOGETHER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEYS.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3-8b-chat-hf",
        messages: [
          { role: "system", content: "You are Lucky, a helpful and friendly AI assistant. Respond to users in a conversational, natural way. Keep responses concise but informative." },
          ...previousMessages.map(msg => ({
            role: msg.isAI ? "assistant" : "user",
            content: msg.content
          })),
          { role: "user", content }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Together.ai API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json() as TogetherAPIResponse;
    return data.choices[0].message.content;
  },

  // Call OpenRouter AI service
  callOpenRouter: async (content: string, previousMessages: Message[]): Promise<string> => {
    const response = await fetch(API_ENDPOINTS.OPENROUTER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEYS.OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Lucky's AI Assistant"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-chat",
        messages: [
          { role: "system", content: "You are Lucky, a helpful and friendly AI assistant. Respond to users in a conversational, natural way. Keep responses concise but informative." },
          ...previousMessages.map(msg => ({
            role: msg.isAI ? "assistant" : "user",
            content: msg.content
          })),
          { role: "user", content }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json() as OpenRouterResponse;
    return data.choices[0].message.content;
  },

  // Attempt AI call with retry logic (silently switch services without toasts)
  sendMessage: async (content: string, previousMessages: Message[]): Promise<string> => {
    // Try primary AI first
    try {
      return await chatService.callPrimaryAI(content, previousMessages);
    } catch (primaryError) {
      console.error("Primary AI service failed:", primaryError);
      
      // Try OpenRouter as second option silently
      try {
        return await chatService.callOpenRouter(content, previousMessages);
      } catch (openRouterError) {
        console.error("OpenRouter service failed:", openRouterError);
        
        // Try fallback AI as last resort silently
        try {
          return await chatService.callFallbackAI(content, previousMessages);
        } catch (fallbackError) {
          console.error("All AI services failed:", fallbackError);
          throw new Error("All AI services failed to respond. Please try again later.");
        }
      }
    }
  }
};

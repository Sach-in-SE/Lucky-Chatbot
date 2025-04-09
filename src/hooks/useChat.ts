
import { useState } from "react";
import { chatService } from "@/api/chatService";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/components/ChatHistory";

export function useChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<string>("");
  const { toast } = useToast();
  
  // Add a user message to the chat
  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAI: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    return userMessage;
  };
  
  // Add an AI response to the chat
  const addAIMessage = (content: string) => {
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content,
      isAI: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    return aiMessage;
  };
  
  // Handle a user sending a new message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add the user message to the chat
    addUserMessage(content);
    setIsLoading(true);
    
    try {
      // Call the chat service to get a response
      const aiResponse = await chatService.sendMessage(content, messages);
      addAIMessage(aiResponse);
    } catch (error) {
      console.error(`Error sending message:`, error);
      addAIMessage("I apologize, but I'm having trouble connecting right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Regenerate the last AI response
  const regenerateResponse = async () => {
    // Find the last user message to regenerate a response for
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => !msg.isAI);
    
    if (lastUserMessageIndex === -1) {
      toast({
        title: "Cannot regenerate",
        description: "No previous message found to regenerate a response for.",
      });
      return;
    }
    
    const lastUserMessage = [...messages].reverse()[lastUserMessageIndex];
    
    // Remove the last AI message(s) until we hit a user message
    const newMessages = [...messages];
    while (newMessages.length > 0 && newMessages[newMessages.length - 1].isAI) {
      newMessages.pop();
    }
    
    setMessages(newMessages);
    setIsLoading(true);
    
    try {
      // Call the chat service to get a new response
      const aiResponse = await chatService.sendMessage(lastUserMessage.content, newMessages);
      addAIMessage(aiResponse);
    } catch (error) {
      console.error(`Error regenerating response:`, error);
      addAIMessage("I apologize, but I'm having trouble connecting right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear the chat history
  const clearChat = () => {
    setMessages([{
      id: "1",
      content: "Hello! 👋 Lucky is here. How can I help you today?",
      isAI: true,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };
  
  return {
    messages,
    isLoading,
    sendMessage,
    regenerateResponse,
    clearChat
  };
}

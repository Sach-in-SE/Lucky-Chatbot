
import React from "react";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { ChatHistoryStyled } from "@/components/chat/ChatHistoryStyled";
import { ChatInput } from "@/components/ChatInput";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";

// Chat suggestions
const CHAT_SUGGESTIONS = [
  "What can you help me with?",
  "Tell me about yourself",
  "How does AI work?"
];

interface ChatPageProps {
  initialMessages?: Array<{
    id: string;
    content: string;
    isAI: boolean;
    timestamp: string;
  }>;
}

const ChatPage: React.FC<ChatPageProps> = ({ 
  initialMessages = [
    {
      id: "1",
      content: "Hello! 👋 Lucky is here. How can I help you today?",
      isAI: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]
}) => {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    regenerateResponse
  } = useChat(initialMessages);
  
  const [showSuggestions, setShowSuggestions] = React.useState(true);

  const handleSendMessage = (content: string) => {
    setShowSuggestions(false);
    sendMessage(content);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <motion.div 
      className="flex flex-col h-full glass rounded-2xl modern-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 overflow-hidden relative">
        <ChatHistoryStyled messages={messages} />
        
        {messages.length > 1 && !isLoading && (
          <motion.div 
            className="absolute bottom-4 right-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={regenerateResponse}
              className="bg-background/80 backdrop-blur-sm"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Regenerate response
            </Button>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-slate-200/60 dark:border-slate-700/60">
        {showSuggestions && messages.length === 1 && (
          <motion.div 
            className="p-4 pb-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-wrap gap-2">
              {CHAT_SUGGESTIONS.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs py-1 px-3 h-auto rounded-full bg-secondary/40 hover:bg-secondary/60 transition-colors text-secondary-foreground"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        <ChatInput 
          onSubmit={handleSendMessage} 
          disabled={isLoading} 
        />
      </div>
    </motion.div>
  );
};

export default ChatPage;

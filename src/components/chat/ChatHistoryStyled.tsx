
import { useRef, useEffect } from "react";
import { ChatMessageStyled } from "./ChatMessageStyled";

export interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp?: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

export function ChatHistoryStyled({ messages }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      <div className="flex-1" />
      {messages.map((message) => (
        <ChatMessageStyled
          key={message.id}
          content={message.content}
          isAI={message.isAI}
          timestamp={message.timestamp}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

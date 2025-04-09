
import React from 'react';
import { User, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  content: string;
  isAI: boolean;
  timestamp?: string;
}

export function ChatMessageStyled({ content, isAI, timestamp }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3 w-full max-w-3xl mx-auto px-4 py-2 rounded-lg mb-4",
      isAI ? "justify-start" : "justify-end"
    )}>
      {isAI && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary/10">
            <MessageCircle className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col rounded-lg px-4 py-2 max-w-[75%]",
        isAI 
          ? "bg-muted/60 text-foreground" 
          : "bg-primary text-primary-foreground",
        "chat-message"
      )}>
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        {timestamp && (
          <time className={cn(
            "text-xs mt-1", 
            isAI ? "text-muted-foreground" : "text-primary-foreground/80"
          )}>
            {timestamp}
          </time>
        )}
      </div>
      
      {!isAI && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary/20">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

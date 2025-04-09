
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface ChatMessageProps {
  message: string;
  isAI: boolean;
  timestamp: string;
}

export function ChatMessage({ message, isAI, timestamp }: ChatMessageProps) {
  const components: Components = {
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const content = String(children).replace(/\n$/, '');
      
      if (!match) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      
      return (
        <SyntaxHighlighter
          language={match[1]}
          style={vscDarkPlus}
          PreTag="div"
        >
          {content}
        </SyntaxHighlighter>
      );
    }
  };

  return (
    <div className={`flex gap-4 p-4 ${isAI ? "bg-background/40" : ""} animate-fade-in chat-message`}>
      <Avatar className={`h-8 w-8 ${isAI ? "border border-blue-500" : "bg-secondary"}`}>
        {isAI ? (
          <AvatarImage src="/lucky-ai-avatar.png" alt="Lucky AI" />
        ) : null}
        <AvatarFallback className="text-xs">
          {isAI ? "AI" : "👤"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {isAI ? "Lucky AI" : "You"}
          </span>
          <span className="text-xs text-muted-foreground">
            {timestamp}
          </span>
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown components={components}>
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}


import { useState, useRef, FormEvent } from "react";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SendButton } from "./chat/SendButton";

interface ChatInputProps {
  onSubmit: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Function to handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[60px] glass-input"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <div className="flex flex-col gap-2">
          <SendButton 
            disabled={!!disabled}
            isProcessing={false}
            isRecording={false}
            hasMessage={!!message.trim()}
          />
        </div>
      </div>
    </form>
  );
}


import { Button } from "../ui/button";
import { Send, LoaderCircle } from "lucide-react";

interface SendButtonProps {
  disabled: boolean;
  isProcessing: boolean;
  isRecording: boolean;
  hasMessage: boolean;
}

export function SendButton({ disabled, isProcessing, hasMessage }: SendButtonProps) {
  return (
    <Button 
      type="submit" 
      size="icon" 
      disabled={disabled || isProcessing || !hasMessage}
      title="Send message"
    >
      {disabled || isProcessing ? 
        <LoaderCircle className="h-4 w-4 animate-spin" /> : 
        <Send className="h-4 w-4" />
      }
    </Button>
  );
}

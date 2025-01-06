import React, { useState, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(" ");
          
          if (event.results[event.results.length - 1].isFinal) {
            onTranscriptionComplete(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          toast.error("Error recording audio. Please try again.");
          setIsRecording(false);
        };

        setRecognition(recognition);
      }
    }
  }, [onTranscriptionComplete]);

  const toggleRecording = () => {
    if (!recognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      toast.success("Recording started. Speak now...");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleRecording}
      className={`transition-colors ${
        isRecording ? "bg-red-100 hover:bg-red-200 dark:bg-red-900" : ""
      }`}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
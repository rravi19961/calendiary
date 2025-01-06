import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
      setRecognition(null);
      return;
    }

    try {
      const newRecognition = new SpeechRecognition();
      setRecognition(newRecognition);
      
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = "en-US";

      newRecognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(" ");
        
        if (event.results[event.results.length - 1].isFinal) {
          onTranscriptionComplete(transcript);
        }
      };

      newRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        toast({
          title: "Error",
          description: "Error recording audio. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
        setRecognition(null);
      };

      newRecognition.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak now...",
      });
    } catch (error) {
      console.error("Error starting recognition:", error);
      toast({
        title: "Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
      setRecognition(null);
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
      title={isRecording ? "Stop recording" : "Start voice recording"}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
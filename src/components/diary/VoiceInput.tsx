import React, { useState, useRef } from "react";
import { Mic, MicOff, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscriptionComplete,
  disabled,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
            const { data, error } = await supabase.functions.invoke('transcribe-audio', {
              body: { audio: base64Audio }
            });

            if (error) throw error;
            
            if (data.text) {
              onTranscriptionComplete(data.text);
              toast({
                title: "Success",
                description: "Voice input transcribed successfully",
              });
            }
          } catch (error) {
            console.error('Transcription error:', error);
            toast({
              title: "Error",
              description: "Failed to transcribe audio. Please try again.",
              variant: "destructive",
            });
          }
        };

        reader.readAsDataURL(audioBlob);
        audioChunks.current = [];
      };

      setMediaRecorder(recorder);
      recorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      
      toast({
        title: "Recording started",
        description: "Speak now...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.pause();
      setIsPaused(true);
      toast({
        title: "Recording paused",
        description: "Click to resume recording",
      });
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
      toast({
        title: "Recording resumed",
        description: "Continue speaking...",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && (isRecording || isPaused)) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      setMediaRecorder(null);
    }
  };

  const handleRecordingAction = () => {
    if (!isRecording && !isPaused) {
      startRecording();
    } else if (isRecording && !isPaused) {
      pauseRecording();
    } else if (isPaused) {
      resumeRecording();
    }
  };

  const getIcon = () => {
    if (!isRecording && !isPaused) return <Mic className="h-4 w-4" />;
    if (isRecording && !isPaused) return <Pause className="h-4 w-4" />;
    if (isPaused) return <Play className="h-4 w-4" />;
    return <MicOff className="h-4 w-4" />;
  };

  const getTooltipText = () => {
    if (!isRecording && !isPaused) return "Start recording";
    if (isRecording && !isPaused) return "Pause recording";
    if (isPaused) return "Resume recording";
    return "Stop recording";
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRecordingAction}
              disabled={disabled}
              className={`transition-colors ${
                isRecording && !isPaused ? "bg-red-100 hover:bg-red-200 dark:bg-red-900" : ""
              } ${
                isPaused ? "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900" : ""
              }`}
            >
              {getIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {(isRecording || isPaused) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={stopRecording}
          className="text-red-500 hover:text-red-600"
        >
          <MicOff className="h-4 w-4 mr-2" />
          Stop
        </Button>
      )}
    </div>
  );
};
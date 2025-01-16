import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TextToSpeechProps {
  text: string;
}

export const TextToSpeech = ({ text }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayback = async () => {
    try {
      if (isPlaying && audio) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      console.log('Calling text-to-speech function with text:', text);

      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text },
      });

      if (error) {
        throw error;
      }

      if (!data?.audioContent) {
        throw new Error("No audio content received");
      }

      // Create audio from base64
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))],
        { type: "audio/mp3" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);

      // Clean up previous audio
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }

      newAudio.onended = () => {
        setIsPlaying(false);
      };

      setAudio(newAudio);
      await newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Text-to-speech error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to play audio. Please try again.",
      });
      setIsPlaying(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePlayback}
      className="ml-2"
      title={isPlaying ? "Stop" : "Play"}
    >
      {isPlaying ? <VolumeOff className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  );
};
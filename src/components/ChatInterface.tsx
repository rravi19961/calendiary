import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format, isValid } from "date-fns";
import { Send, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatInterface = ({ selectedDate }: { selectedDate: Date }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const formattedDate = isValid(selectedDate) ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  const { data: chatHistory = [], refetch: refetchChat } = useQuery({
    queryKey: ['chat-history', selectedDate],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('chat_history')
        .select('role, content')
        .eq('date', formattedDate)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as ChatMessage[];
    },
    enabled: !!user,
  });

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    try {
      setIsLoading(true);
      
      // Save user message
      const { error: userMsgError } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          date: formattedDate,
          content: message,
          role: 'user'
        });

      if (userMsgError) throw userMsgError;

      // Get AI response
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message,
          date: formattedDate,
          userId: user.id
        },
      });

      if (error) throw error;

      // Save AI response
      const { error: aiMsgError } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          date: formattedDate,
          content: data.response,
          role: 'assistant'
        });

      if (aiMsgError) throw aiMsgError;

      await refetchChat();
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-grow overflow-auto space-y-4 p-4">
        {chatHistory.length === 0 ? (
          <p className="text-muted-foreground text-center">
            Start chatting about your day! I'll help you reflect and remember important moments.
          </p>
        ) : (
          chatHistory.map((msg, index) => (
            <Card 
              key={index} 
              className={`p-3 ${
                msg.role === 'user' 
                  ? 'ml-auto chat-bubble-user' 
                  : 'mr-auto chat-bubble-assistant'
              } max-w-[80%]`}
            >
              <p className="text-sm">{msg.content}</p>
            </Card>
          ))
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your day..."
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !message.trim()}
            className="self-end btn-primary"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

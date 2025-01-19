import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Send, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CanvasRevealEffect } from "@/components/ui/canvas-effect";
import { AnimatePresence, motion } from "framer-motion";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatInterface = ({ selectedDate }: { selectedDate: Date }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

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
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative mx-auto w-full items-center justify-center overflow-hidden"
      >
        <div className="relative flex w-full items-center justify-center p-4">
          <AnimatePresence>
            <div className="tracking-tightest flex select-none flex-col py-2 text-center text-3xl font-extrabold leading-none md:flex-col md:text-8xl lg:flex-row"></div>
            {hovered && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <CanvasRevealEffect
                  animationSpeed={5}
                  containerClassName="bg-transparent opacity-30 dark:opacity-50"
                  colors={[
                    [245, 5, 55],
                    [245, 5, 55],
                  ]}
                  opacities={[1, 0.8, 1, 0.8, 0.5, 0.8, 1, 0.5, 1, 3]}
                  dotSize={2}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="z-20 w-full">
            <ScrollArea className="h-[360px] w-full overflow-auto p-1">
              <div className="px-6">
                <div className="relative flex h-full w-full justify-center text-center">
                  <h1 className="flex select-none py-2 text-center text-2xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-4xl">
                    <span
                      data-content="AI."
                      className="before:animate-gradient-background-1 relative before:absolute before:bottom-4 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
                    >
                      <span className="from-gradient-1-start to-gradient-1-end animate-gradient-foreground-1 bg-gradient-to-r bg-clip-text px-2 text-transparent">
                        AI.
                      </span>
                    </span>
                    <span
                      data-content="Chat."
                      className="before:animate-gradient-background-2 relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
                    >
                      <span className="from-gradient-2-start to-gradient-2-end animate-gradient-foreground-2 bg-gradient-to-r bg-clip-text px-2 text-transparent">
                        Chat.
                      </span>
                    </span>
                    <span
                      data-content="Experience."
                      className="before:animate-gradient-background-3 relative before:absolute before:bottom-1 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
                    >
                      <span className="from-gradient-3-start to-gradient-3-end animate-gradient-foreground-3 bg-gradient-to-r bg-clip-text px-2 text-transparent">
                        Experience.
                      </span>
                    </span>
                  </h1>
                </div>
                <p className="md:text-md lg:text-md mx-auto mt-1 text-center text-xs text-primary/60 md:max-w-2xl">
                  How can I help you today?
                </p>
              </div>
              
              <div className="space-y-4 p-4">
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
            </ScrollArea>

            <div className="relative mt-2 w-full">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something with AI"
                className="pl-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                variant="default"
                size="icon"
                className="absolute left-1.5 top-1.5 h-7 rounded-sm"
                onClick={() => setMessage("")}
              >
                <Plus className="h-5 w-5" />
                <span className="sr-only">New Chat</span>
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                variant="default"
                size="icon"
                className="absolute right-1.5 top-1.5 h-7 rounded-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
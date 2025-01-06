import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ChatSection = () => {
  const { data: chatStarters = [] } = useQuery({
    queryKey: ["chat-starters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_starters")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Chat Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <ChatInterface chatStarters={chatStarters} />
      </CardContent>
    </Card>
  );
};
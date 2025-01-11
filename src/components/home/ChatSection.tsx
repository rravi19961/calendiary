import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";

interface ChatSectionProps {
  selectedDate: Date;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ selectedDate }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Chat Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ChatInterface selectedDate={selectedDate} />
      </CardContent>
    </Card>
  );
};
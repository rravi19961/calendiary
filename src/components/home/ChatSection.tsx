import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";

interface ChatSectionProps {
  selectedDate: Date;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ selectedDate }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-bold text-calendiary-primary text-left">Chat Assistant</h2>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ChatInterface selectedDate={selectedDate} />
      </CardContent>
    </Card>
  );
};
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";

interface ChatSectionProps {
  selectedDate: Date;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ selectedDate }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Chat Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ChatInterface selectedDate={selectedDate} />
      </CardContent>
    </Card>
  );
};
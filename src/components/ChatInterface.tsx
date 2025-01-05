import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { QuestionFlow } from "./QuestionFlow";

export const ChatInterface = ({ chatStarters }: { chatStarters: any[] }) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentStarter, setCurrentStarter] = useState("");

  useEffect(() => {
    if (chatStarters?.length > 0) {
      const randomIndex = Math.floor(Math.random() * chatStarters.length);
      setCurrentStarter(chatStarters[randomIndex].message);
    }
  }, [chatStarters]);

  if (showQuestions) {
    return <QuestionFlow onBack={() => setShowQuestions(false)} />;
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground mb-4">{currentStarter}</p>
        <Button 
          onClick={() => setShowQuestions(true)}
          className="w-full"
        >
          Let's Begin
        </Button>
      </Card>
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { QuestionFlow } from "./QuestionFlow";

export const ChatInterface = ({ chatStarters }: { chatStarters: any[] }) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentStarterIndex, setCurrentStarterIndex] = useState(0);

  useEffect(() => {
    if (chatStarters?.length > 0) {
      const interval = setInterval(() => {
        setCurrentStarterIndex((prevIndex) => 
          prevIndex === chatStarters.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [chatStarters]);

  if (showQuestions) {
    return <QuestionFlow onBack={() => setShowQuestions(false)} />;
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-muted/50">
        {chatStarters?.length > 0 ? (
          <p className="text-sm text-muted-foreground mb-4">
            {chatStarters[currentStarterIndex].message}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            Welcome! Let's start your journey.
          </p>
        )}
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
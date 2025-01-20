import React from "react";
import { QUOTES } from "./constants";

interface HeaderSectionProps {
  currentQuoteIndex: number;
}

export function HeaderSection({ currentQuoteIndex }: HeaderSectionProps) {
  return (
    <header className="bg-gradient-to-r from-[#242d58] to-[#4a5482] text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Digital Diary</h1>
          <p className="text-lg italic">
            "{QUOTES[currentQuoteIndex]}"
          </p>
        </div>
      </div>
    </header>
  );
}
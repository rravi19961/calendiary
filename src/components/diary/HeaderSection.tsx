import React from "react";
import { motion } from "framer-motion";
import { QUOTES } from "./constants";

interface HeaderSectionProps {
  currentQuoteIndex: number;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  currentQuoteIndex,
}) => {
  return (
    <header className="bg-gradient-to-r from-[#E6F2FA] to-[#F8F8F8] dark:from-gray-900 dark:to-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 italic"
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {QUOTES[currentQuoteIndex]}
            </motion.p>
          </div>
        </div>
      </div>
    </header>
  );
};
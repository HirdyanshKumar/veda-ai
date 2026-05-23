'use client';

import React from 'react';
import { Search, Sparkles, ShieldCheck, BookOpen } from 'lucide-react';
import StageItem from './StageItem';

interface ProgressStagesProps {
  currentStage: number;
}

export const ProgressStages: React.FC<ProgressStagesProps> = ({ currentStage }) => {
  const stages = [
    {
      stageNumber: 1 as const,
      icon: Search,
      label: "Retrieving assignment details",
      sublabel: "Loading your configuration",
    },
    {
      stageNumber: 2 as const,
      icon: Sparkles,
      label: "Generating questions with AI",
      sublabel: "Calling Gemini API",
    },
    {
      stageNumber: 3 as const,
      icon: ShieldCheck,
      label: "Validating paper structure",
      sublabel: "Checking format and marks",
    },
    {
      stageNumber: 4 as const,
      icon: BookOpen,
      label: "Saving to your library",
      sublabel: "Almost ready...",
    },
  ];

  return (
    <div className="flex flex-col w-full px-2">
      {stages.map((stage) => (
        <StageItem
          key={stage.stageNumber}
          stageNumber={stage.stageNumber}
          icon={stage.icon}
          label={stage.label}
          sublabel={stage.sublabel}
          currentStage={currentStage}
        />
      ))}
    </div>
  );
};

export default ProgressStages;

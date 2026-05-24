import React from 'react';

interface DifficultyBadgeProps {
  difficulty: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const diff = difficulty.toLowerCase();
  
  let label = "Moderate";
  let classes = "bg-[#FEF9C3] text-[#CA8A04]";

  if (diff === 'easy') {
    label = "Easy";
    classes = "bg-[#DCFCE7] text-[#16A34A]";
  } else if (diff === 'hard' || diff === 'challenging') {
    label = "Challenging";
    classes = "bg-[#FEE2E2] text-[#DC2626]";
  } else if (diff === 'medium' || diff === 'moderate') {
    label = "Moderate";
    classes = "bg-[#FEF9C3] text-[#CA8A04]";
  }

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${classes} select-none mr-2`}>
      {label}
    </span>
  );
};

export default DifficultyBadge;

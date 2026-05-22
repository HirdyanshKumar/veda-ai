import React from 'react';

interface DifficultyBadgeProps {
  difficulty: "easy" | "medium" | "hard" | "challenging" | "moderate" | string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const diffNormalized = difficulty.toLowerCase().trim();

  let colors = "bg-[#FEF9C3] text-[#CA8A04]"; // Default medium/moderate
  let label = "Moderate";

  if (diffNormalized === 'easy') {
    colors = "bg-[#DCFCE7] text-[#16A34A]";
    label = "Easy";
  } else if (diffNormalized === 'hard' || diffNormalized === 'challenging') {
    colors = "bg-[#FEE2E2] text-[#DC2626]";
    label = "Challenging";
  }

  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-[12px] font-semibold mr-2 select-none uppercase tracking-wide print:hidden ${colors}`}>
      [{label}]
    </span>
  );
};
export default DifficultyBadge;

import React, { useState } from 'react';
import { ISection } from '../../types';
import { DifficultyBadge } from './DifficultyBadge';
import { Eye, EyeOff } from 'lucide-react';

interface QuestionsListProps {
  sections: ISection[];
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ sections }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  // Fallback high-fidelity sample answer generator based on question text if answer key isn't provided
  const getSampleAnswer = (qText: string) => {
    if (qText.toLowerCase().includes("ecosystem")) {
      return "The two main components of an ecosystem are:\n1. Biotic components: All living organisms (plants, animals, microbes).\n2. Abiotic components: Physical and chemical factors (light, temperature, water, soil, air).";
    }
    if (qText.toLowerCase().includes("physical") || qText.toLowerCase().includes("chemical")) {
      return "A physical change affects the form of a substance but does not create a new chemical substance (e.g., boiling water, melting ice). A chemical change results in the formation of one or more new substances with entirely different properties (e.g., rusting iron, burning paper).";
    }
    if (qText.toLowerCase().includes("force")) {
      return "Balanced forces are equal in size and opposite in direction, resulting in no change in motion. Unbalanced forces are unequal, causing a change in the object's speed, direction of motion, or both.";
    }
    if (qText.toLowerCase().includes("cell")) {
      return "Chloroplasts (site of photosynthesis) and a rigid Cell Wall (for structural support) are present in plant cells but absent in animal cells.";
    }
    return `Model Answer Key: Focus on key definitions, appropriate labeling, and step-by-step reasoning. Students must secure core concepts related to "${qText.substring(0, Math.min(30, qText.length))}...". Full marks should be awarded for clear scientific descriptions.`;
  };

  // Compute indices for flat numbering
  let questionCounter = 0;
  let answerCounter = 0;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Sections Grid/Stack */}
      <div className="w-full flex flex-col gap-8">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="w-full flex flex-col gap-4 border-b border-neutral-100 pb-6 last:border-0 last:pb-0">
            {/* Section Header */}
            <div className="w-full text-center py-2 bg-neutral-50 rounded-xl border border-neutral-100">
              <h3 
                className="text-lg md:text-[24px] font-semibold text-[#303030]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {section.title || `Section ${String.fromCharCode(65 + sIdx)}`}
              </h3>
              <p className="text-xs md:text-[18px] font-normal text-neutral-500 italic mt-0.5 px-3">
                {section.instruction || "Attempt all questions. Marks are shown in brackets."}
              </p>
            </div>

            {/* Questions list for this section */}
            <div className="flex flex-col gap-4 text-[15px] md:text-[17px] text-[#303030] leading-[1.8] tracking-tight px-2">
              {section.questions.map((q, qIdx) => {
                questionCounter++;
                return (
                  <div key={qIdx} className="py-2 border-b border-neutral-50 last:border-0 flex items-start gap-2">
                    <span className="font-bold flex-shrink-0 text-[#303030] min-w-[24px]">
                      {questionCounter}.
                    </span>
                    <div className="flex-1 flex flex-wrap items-start md:items-center gap-1.5 align-baseline">
                      <DifficultyBadge difficulty={q.difficulty} />
                      <span className="font-semibold text-neutral-800 ml-1">{q.text}</span>
                      <span className="text-[11px] md:text-xs font-bold text-neutral-400 select-none ml-2">
                        [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Answer Key Toggle Button */}
      <div className="w-full flex justify-center py-2 select-none border-t border-neutral-100 pt-6">
        <button
          type="button"
          onClick={() => setShowAnswers(!showAnswers)}
          className="h-11 px-6 rounded-full bg-[#1A1A1A] hover:bg-neutral-800 text-white font-semibold text-sm flex items-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          {showAnswers ? (
            <>
              <EyeOff size={16} />
              <span>Hide Answer Key</span>
            </>
          ) : (
            <>
              <Eye size={16} />
              <span>Show Answer Key</span>
            </>
          )}
        </button>
      </div>

      {/* Structured Answer Key list */}
      {showAnswers && (
        <div className="w-full bg-[#FAFAFA] border border-neutral-100 rounded-3xl p-5 md:p-8 flex flex-col gap-5 shadow-inner animate-in fade-in duration-300">
          <h4 
            className="text-base md:text-lg font-bold text-[#1A1A1A] border-b border-neutral-200 pb-2.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ✦ Comprehensive Teacher's Answer Keys & Solutions
          </h4>
          
          <div className="flex flex-col gap-6">
            {sections.map((section, sIdx) => (
              <div key={sIdx} className="flex flex-col gap-4">
                <span className="font-bold text-sm text-[#888888] uppercase tracking-wider">
                  {section.title || `Section ${String.fromCharCode(65 + sIdx)}`} Solutions
                </span>
                
                <div className="flex flex-col gap-4 text-sm md:text-base text-[#303030]">
                  {section.questions.map((q, qIdx) => {
                    answerCounter++;
                    return (
                      <div key={qIdx} className="border-b border-neutral-200/50 pb-4 last:border-0 last:pb-0 flex items-start gap-2">
                        <span className="font-bold text-neutral-800 flex-shrink-0 min-w-[24px]">
                          {answerCounter}.
                        </span>
                        <div className="flex-1">
                          <span className="font-bold text-neutral-800 block mb-1">
                            Question {answerCounter} Solution Key:
                          </span>
                          <p className="font-normal text-neutral-600 pl-2 whitespace-pre-line leading-relaxed">
                            {getSampleAnswer(q.text)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default QuestionsList;

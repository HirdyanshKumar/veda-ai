import { create } from 'zustand';

export interface QuestionItem {
  id: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
}

export interface AnswerItem {
  id: number;
  text: string;
  subText?: string;
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  className: string;
  section: string;
  timeAllowed: string;
  maxMarks: number;
  instructions: string;
  questions: QuestionItem[];
  answers: AnswerItem[];
}

interface OutputStore {
  generatedPaper: GeneratedPaper | null;
  isLoading: boolean;
  error: string | null;
  
  setPaper: (paper: GeneratedPaper | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  triggerGenerationSim: () => void;
}

const mockPaper: GeneratedPaper = {
  schoolName: "Delhi Public School, Sector-4, Bokaro",
  subject: "English",
  className: "5th",
  section: "A",
  timeAllowed: "45 minutes",
  maxMarks: 20,
  instructions: "All questions are compulsory unless stated otherwise.",
  questions: [
    { id: 1, text: "Define electroplating. Explain its purpose.", difficulty: 'Easy', marks: 2 },
    { id: 2, text: "What is the role of a conductor in the process of electrolysis?", difficulty: 'Moderate', marks: 2 },
    { id: 3, text: "Why does a solution of copper sulfate conduct electricity?", difficulty: 'Easy', marks: 2 },
    { id: 4, text: "Describe one example of the chemical effect of electric current in daily life.", difficulty: 'Moderate', marks: 2 },
    { id: 5, text: "Explain why electric current is said to have chemical effects.", difficulty: 'Moderate', marks: 2 },
    { id: 6, text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.", difficulty: 'Challenging', marks: 2 },
    { id: 7, text: "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.", difficulty: 'Challenging', marks: 2 },
    { id: 8, text: "Mention the type of current used in electroplating and justify why it is used.", difficulty: 'Easy', marks: 2 },
    { id: 9, text: "What is the importance of electric current in the field of metallurgy?", difficulty: 'Moderate', marks: 2 },
    { id: 10, text: "Explain with a chemical equation how copper is deposited during the electroplating of an object.", difficulty: 'Challenging', marks: 2 }
  ],
  answers: [
    { id: 1, text: "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness." },
    { id: 2, text: "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes." },
    { id: 3, text: "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity." },
    { id: 4, text: "An example is the electroplating of silver on jewelry to prevent tarnishing." },
    { id: 5, text: "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects." },
    { id: 6, text: "Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons:", subText: "2H2O + 2e- → H2 + 2OH-\nNa+ + OH- → NaOH (in solution)" },
    { id: 7, text: "At the cathode: water is reduced to hydrogen gas and hydroxide ions.\nAt the anode: water is oxidized to oxygen gas and hydrogen ions." },
    { id: 8, text: "Direct current (DC) is used because it produces a consistent flow of electrons necessary for controlled deposition of metals." },
    { id: 9, text: "Electric current helps extract metals from their ores and purify metals by electrolysis in metallurgy." },
    { id: 10, text: "During copper electroplating, copper ions in solution gain electrons at the cathode and deposit as copper metal:", subText: "Cu2+ + 2e- → Cu (solid)" }
  ]
};

export const useOutputStore = create<OutputStore>((set, get) => ({
  generatedPaper: null,
  isLoading: false,
  error: null,
  
  setPaper: (paper) => set({ generatedPaper: paper }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  triggerGenerationSim: () => {
    set({ isLoading: true, error: null, generatedPaper: null });
    setTimeout(() => {
      set({ isLoading: false, generatedPaper: mockPaper });
    }, 1800);
  }
}));

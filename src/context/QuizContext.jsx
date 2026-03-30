import { createContext, useContext, useMemo, useState } from 'react';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [lastResult, setLastResult] = useState(null);

  const value = useMemo(() => ({ lastResult, setLastResult }), [lastResult]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}

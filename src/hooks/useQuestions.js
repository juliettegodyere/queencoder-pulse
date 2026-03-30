import { useEffect, useState } from 'react';
import { subscribeQuestion, subscribeQuestions } from '../features/quiz/quizService.js';

export function useQuestions(sessionId) {
  const [questions, setQuestions] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setQuestions(null);
      return undefined;
    }
    setError(null);
    const unsub = subscribeQuestions(
      sessionId,
      (list) => setQuestions(list),
      (err) => setError(err)
    );
    return () => unsub();
  }, [sessionId]);

  const loading = questions === undefined;
  return { questions: questions || [], loading, error };
}

export function useActiveQuestion(sessionId, questionId) {
  const [question, setQuestion] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId || !questionId) {
      setQuestion(null);
      return undefined;
    }
    setError(null);
    const unsub = subscribeQuestion(
      sessionId,
      questionId,
      (data) => setQuestion(data ?? null),
      (err) => setError(err)
    );
    return () => unsub();
  }, [sessionId, questionId]);

  const loading = question === undefined;
  return { question, loading, error };
}

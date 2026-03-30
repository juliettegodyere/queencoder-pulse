import { FAST_RESPONSE_SECONDS, POINTS } from './constants.js';

export function computeScore({ isCorrect, isFirstCorrect, responseTimeSeconds }) {
  if (!isCorrect) return 0;
  let score = POINTS.CORRECT;
  if (isFirstCorrect) score += POINTS.FIRST_CORRECT_BONUS;
  if (responseTimeSeconds < FAST_RESPONSE_SECONDS) score += POINTS.FAST_BONUS;
  return score;
}

export function normalizeChoices(raw) {
  if (Array.isArray(raw)) return raw.map((c) => String(c).trim()).filter(Boolean);
  return [];
}

export function validateQuestion({ prompt, choices, correctIndex }) {
  if (!String(prompt || '').trim()) return 'Enter a question prompt.';
  if (choices.length < 2) return 'Add at least two answer choices.';
  if (correctIndex < 0 || correctIndex >= choices.length) return 'Pick a valid correct answer.';
  return null;
}

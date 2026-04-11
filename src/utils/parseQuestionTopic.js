/**
 * Preset questions store a label as `[Topic · …]\n\nPrompt…`.
 * Manual questions may have no tag — they become "Custom / untagged".
 */
export function parseTopicTagFromPrompt(prompt) {
  const s = String(prompt || '').trim();
  const m = s.match(/^\[([^\]]+)\]\s*\n\s*\n/s) || s.match(/^\[([^\]]+)\]\s*$/);
  if (m) return m[1].trim();
  return 'Custom / untagged';
}

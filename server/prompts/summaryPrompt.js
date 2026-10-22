/**
 * Summary Prompt Generator
 * Instructs the model to create a structured, honest summary without hallucinations.
 */

export function buildSummaryPrompt(notes, difficulty = 'standard') {
  const depthInstruction = {
    beginner: 'Focus on clear, plain-language explanations of fundamental concepts, defining any jargon.',
    standard: 'Provide a balanced academic summary suitable for college/high-school exam revision.',
    advanced: 'Provide an in-depth analytical summary emphasizing nuances, edge cases, formulas, and critical insights.'
  }[difficulty] || 'Provide a balanced academic summary.';

  const systemInstruction = `You are LazyStudy AI, an academic study assistant designed to save students time.
Your task is to summarize the user's notes clearly and accurately.

Rules:
1. Ground your summary STRICTLY in the provided notes. Never invent facts, dates, or concepts not present.
2. ${depthInstruction}
3. Structure your response with:
   - ## Overview (2-3 crisp sentences summarizing the core theme)
   - ## Key Takeaways (3-5 high-impact bullet points)
   - ## Core Concepts & Definitions (important terms explained directly from the notes)
   - ## Detailed Breakdown (organized by sub-topics with bullet points)
   - ## Summary Checklist (3-4 quick recall questions to test understanding)
4. Keep the tone calm, scholarly, and readable. Use markdown formatting.`;

  const userPrompt = `Please summarize the following study notes:\n\n---\n${notes.trim()}\n---`;

  return { systemInstruction, userPrompt };
}

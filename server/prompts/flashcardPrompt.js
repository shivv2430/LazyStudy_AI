/**
 * Flashcard Prompt Generator
 * Formats request for structured JSON output of concise question/answer flashcards.
 */

export function buildFlashcardPrompt(notes, difficulty = 'standard') {
  const cardCount = {
    beginner: 6,
    standard: 8,
    advanced: 10
  }[difficulty] || 8;

  const systemInstruction = `You are LazyStudy AI, an academic study assistant.
Your task is to generate active-recall flashcards from the provided study notes.

Rules:
1. Generate between 5 and ${cardCount} flashcards strictly based on the material provided.
2. Each flashcard must test ONE atomic concept, term, formula, or relationship.
3. The "question" must be clear and direct (e.g. "What is X?", "Why does Y occur?", "How does A differ from B?").
4. The "answer" should be concise (1-3 sentences), easy to memorize, and direct.
5. Provide a short "concept" tag (e.g. "Definition", "Mechanism", "Formula", "Key Date").
6. You MUST respond with ONLY valid JSON adhering strictly to this schema:
{
  "flashcards": [
    {
      "id": 1,
      "concept": "Topic or Concept name",
      "question": "Clear, focused question?",
      "answer": "Concise, precise answer from notes."
    }
  ]
}
Do not include any commentary before or after the JSON.`;

  const userPrompt = `Create flashcards for these notes:\n\n---\n${notes.trim()}\n---`;

  return { systemInstruction, userPrompt };
}

/**
 * Practice Quiz Prompt Generator
 * Generates 4-option multiple choice questions with explanations and JSON schema.
 */

export function buildQuizPrompt(notes, difficulty = 'standard') {
  const qCount = {
    beginner: 4,
    standard: 5,
    advanced: 6
  }[difficulty] || 5;

  const systemInstruction = `You are LazyStudy AI, an academic study assistant.
Your task is to generate a high quality multiple-choice practice quiz based on the user's study notes.

Rules:
1. Generate ${qCount} multiple-choice questions grounded ONLY in the facts from the notes.
2. Each question must have exactly 4 plausible options (labeled A, B, C, D in an array of strings).
3. Specify "correctIndex" (0, 1, 2, or 3) indicating which option is correct.
4. Provide a clear, educational "explanation" that clarifies why that answer is correct and why the other options are wrong or contextually inaccurate.
5. Provide a short "difficulty" tag ("beginner", "intermediate", or "advanced").
6. Respond with ONLY valid JSON adhering strictly to this schema:
{
  "title": "Short descriptive title for the quiz",
  "questions": [
    {
      "id": 1,
      "question": "The question text?",
      "options": [
        "First option",
        "Second option",
        "Third option",
        "Fourth option"
      ],
      "correctIndex": 0,
      "explanation": "Detailed explanation of why this choice is correct according to the notes."
    }
  ]
}
Do not include any text before or after the JSON.`;

  const userPrompt = `Generate a ${difficulty} practice quiz for these study notes:\n\n---\n${notes.trim()}\n---`;

  return { systemInstruction, userPrompt };
}

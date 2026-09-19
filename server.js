const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.static(__dirname));

app.post("/generate-quiz", async (req, res) => {
    try {
        const notes = req.body.notes;
        const questionCount = req.body.questionCount;
        const difficulty = req.body.difficulty;

        if (!notes || notes.trim() === "") {
            return res.status(400).json({
                error: "Please enter your notes."
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash"
        });

        const prompt = `
Create ${questionCount} multiple-choice questions from the study notes below.

Difficulty: ${difficulty}

Rules:
- Create exactly ${questionCount} questions.
- Each question must have exactly 4 options.
- Only one option is correct.
- Questions must be based only on the notes.
- Return only JSON.
- Do not use markdown.

JSON format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "answer": "Correct option"
    }
  ]
}

Study Notes:
${notes}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log("GEMINI RESPONSE:");
        console.log(responseText);

        let cleanText = responseText.trim();

        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.slice(7);
        }

        if (cleanText.startsWith("```")) {
            cleanText = cleanText.slice(3);
        }

        if (cleanText.endsWith("```")) {
            cleanText = cleanText.slice(0, -3);
        }

        cleanText = cleanText.trim();

        const quizData = JSON.parse(cleanText);

        if (!quizData.questions || !Array.isArray(quizData.questions)) {
            return res.status(500).json({
                error: "AI did not return valid questions."
            });
        }

        res.json(quizData);

    } catch (error) {
        console.log("GEMINI ERROR:");
        console.log(error);

        res.status(500).json({
            error: "Quiz could not be generated. Check the server terminal."
        });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port 3000");
});
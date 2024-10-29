const express = require('express');
const Question = require('./models/questions'); // Ensure the path is correct

const router = express.Router();

// Middleware for validating a single question
const validateQuestionData = (req, res, next) => {
    const { question, options, correct } = req.body;

    if (!question || !options || typeof correct !== 'number') {
        return res.status(400).json({ error: 'Question, options, and correct index are required.' });
    }

    if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: 'Options must be an array with at least two items.' });
    }

    if (correct < 0 || correct >= options.length) {
        return res.status(400).json({ error: 'Correct answer index is out of range.' });
    }

    next();
};

// Middleware for validating bulk questions
const validateBulkQuestions = (req, res, next) => {
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'An array of questions is required.' });
    }

    for (const question of questions) {
        const { question: q, options, correct } = question;
        if (!q || !options || typeof correct !== 'number') {
            return res.status(400).json({ error: 'Each question must include a valid question, options, and correct index.' });
        }
        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ error: 'Options must be an array with at least two items.' });
        }
        if (correct < 0 || correct >= options.length) {
            return res.status(400).json({ error: 'Correct answer index is out of range for each question.' });
        }
    }

    next();
};

// Create a new question
router.post('/questions', validateQuestionData, async (req, res) => {
    const { question, options, correct } = req.body;

    try {
        const newQuestion = new Question({ question, options, correct });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Error saving question:', error);
        res.status(500).json({ error: error.message });
    }
});

// Bulk create questions
router.post('/questions/bulk', validateBulkQuestions, async (req, res) => {
    const questions = req.body;

    try {
        const newQuestions = await Question.insertMany(questions);
        res.status(201).json(newQuestions);
    } catch (error) {
        console.error('Error saving bulk questions:', error);
        res.status(500).json({ error: error.message });
    }
});
// Get 10 random questions


// Get all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a single question by ID
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update a question by ID
router.put('/questions/:id', validateQuestionData, async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete a question by ID
router.delete('/questions/:id', async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/questions/play/:offset', async (req, res) => {
    const offset = parseInt(req.params.offset) || 0;
    try {
        const questions = await Question.find().skip(offset).limit(10);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});
async function fetchQuestions() {
    try {
        const response = await fetch(`http://localhost:3001/api/questions/random`);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json(); // Return the array of questions
    } catch (error) {
        console.error("Error fetching questions:", error);
        return []; // Return an empty array on error
    }
}
router.get('/questions/batch/play', async (req, res) => {
    try {
        const questions = await Question.aggregate([{ $sample: { size: 10 } }]); // Randomly select 10 questions
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching random batch of questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});



module.exports = router;

const Question = require('../models/Question');
const Exam = require('../models/Exam');

// @desc    Get questions for an exam
// @route   GET /api/questions/:examId
// @access  Private
const getQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
    const { shuffle } = req.query;

    let questions = await Question.find({ examId }).select('-correctAnswer');

    // If admin, get correct answers too
    if (req.user.role === 'admin') {
      questions = await Question.find({ examId });
    }

    // If shuffle parameter is true, randomize order (for student exam)
    if (shuffle === 'true' && req.user.role === 'student') {
      questions = shuffleArray(questions);
    }

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single question
// @route   GET /api/questions/single/:id
// @access  Private/Admin
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add question
// @route   POST /api/questions
// @access  Private/Admin
const addQuestion = async (req, res) => {
  try {
    const { examId, question, options, correctAnswer, marks } = req.body;

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Verify correct answer index is valid
    if (correctAnswer < 0 || correctAnswer > 3) {
      return res.status(400).json({ message: 'Correct answer must be between 0 and 3' });
    }

    const newQuestion = await Question.create({
      examId,
      question,
      options,
      correctAnswer,
      marks: marks || 1
    });

    // Update exam total marks
    exam.totalMarks = (exam.totalMarks || 0) + (marks || 1);
    await exam.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, marks } = req.body;

    const existingQuestion = await Question.findById(req.params.id);

    if (!existingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const exam = await Exam.findById(existingQuestion.examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Calculate marks difference
    const marksDiff = (marks || 1) - existingQuestion.marks;

    existingQuestion.question = question || existingQuestion.question;
    existingQuestion.options = options || existingQuestion.options;
    existingQuestion.correctAnswer = correctAnswer !== undefined ? correctAnswer : existingQuestion.correctAnswer;
    existingQuestion.marks = marks || existingQuestion.marks;

    await existingQuestion.save();

    // Update exam total marks
    exam.totalMarks = (exam.totalMarks || 0) + marksDiff;
    await exam.save();

    res.json(existingQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const exam = await Exam.findById(question.examId);
    if (exam) {
      // Update exam total marks
      exam.totalMarks = (exam.totalMarks || 0) - question.marks;
      await exam.save();
    }

    await question.deleteOne();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

module.exports = {
  getQuestions,
  getQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion
};

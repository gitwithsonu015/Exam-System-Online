const Result = require('../models/Result');
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const User = require('../models/User');

// @desc    Submit exam result
// @route   POST /api/results
// @access  Private/Student
const submitResult = async (req, res) => {
  try {
    const { examId, answers, timeTaken } = req.body;
    const userId = req.user._id;

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if already submitted
    const existingResult = await Result.findOne({ userId, examId });
    if (existingResult) {
      return res.status(400).json({ message: 'You have already attempted this exam' });
    }

    // Get all questions for the exam
    const questions = await Question.find({ examId });
    const questionMap = {};
    questions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });

    // Calculate score
    let score = 0;
    let totalMarks = 0;
    const evaluatedAnswers = [];

    for (const answer of answers) {
      const question = questionMap[answer.questionId];
      if (question) {
        totalMarks += question.marks;
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) {
          score += question.marks;
        }
        evaluatedAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect
        });
      }
    }

    // Create result
    const result = await Result.create({
      userId,
      examId,
      score,
      totalMarks,
      answers: evaluatedAnswers,
      timeTaken: timeTaken || 0
    });

    // Populate user and exam details
    await result.populate('userId', 'name email');
    await result.populate('examId', 'title duration');




    res.status(201).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's results
// @route   GET /api/results/student
// @access  Private/Student
const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate('examId', 'title duration')
      .sort('-createdAt');

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific result
// @route   GET /api/results/:id
// @access  Private
const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('examId', 'title duration');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Check authorization
    if (result.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get questions with answers
    const questions = await Question.find({ examId: result.examId._id });
    
    // Map questions to result
    const questionDetails = result.answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      return {
        question: question ? question.question : null,
        options: question ? question.options : [],
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question ? question.correctAnswer : null,
        isCorrect: answer.isCorrect
      };
    }).filter(q => q.question !== null);

    res.json({
      ...result.toObject(),
      questionDetails
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get results for exam (admin)
// @route   GET /api/results/exam/:examId
// @access  Private/Admin
const getExamResults = async (req, res) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .populate('userId', 'name email')
      .sort('-createdAt');

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all results (admin)
// @route   GET /api/results
// @access  Private/Admin
const getAllResults = async (req, res) => {
  try {
    const { examId, userId } = req.query;

    let query = {};
    if (examId) query.examId = examId;
    if (userId) query.userId = userId;

    const results = await Result.find(query)
      .populate('userId', 'name email')
      .populate('examId', 'title')
      .sort('-createdAt');

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitResult,
  getStudentResults,
  getResult,
  getExamResults,
  getAllResults
};

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { 
  getQuestions, 
  getQuestion, 
  addQuestion, 
  updateQuestion, 
  deleteQuestion 
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Add question validation
const addQuestionValidation = [
  body('examId').notEmpty().withMessage('Exam ID is required'),
  body('question').notEmpty().withMessage('Question is required'),
  body('options').isArray({ min: 4, max: 4 }).withMessage('Exactly 4 options are required'),
  body('correctAnswer').isNumeric().withMessage('Correct answer must be a number'),
  body('correctAnswer').custom(value => value >= 0 && value <= 3).withMessage('Correct answer must be between 0 and 3')
];

// Update question validation
const updateQuestionValidation = [
  body('question').optional().notEmpty().withMessage('Question cannot be empty'),
  body('options').optional().isArray({ min: 4, max: 4 }).withMessage('Exactly 4 options are required'),
  body('correctAnswer').optional().isNumeric().withMessage('Correct answer must be a number')
];

// @route   GET /api/questions/:examId
// @desc    Get questions for an exam
// @access  Private
router.get('/:examId', protect, getQuestions);

// @route   GET /api/questions/single/:id
// @desc    Get single question
// @access  Private/Admin
router.get('/single/:id', protect, adminMiddleware, getQuestion);

// @route   POST /api/questions
// @desc    Add question
// @access  Private/Admin
router.post('/', protect, adminMiddleware, addQuestionValidation, validate, addQuestion);

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private/Admin
router.put('/:id', protect, adminMiddleware, updateQuestionValidation, validate, updateQuestion);

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private/Admin
router.delete('/:id', protect, adminMiddleware, deleteQuestion);

module.exports = router;

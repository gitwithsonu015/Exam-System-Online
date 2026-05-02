const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { 
  submitResult, 
  getStudentResults, 
  getResult, 
  getExamResults, 
  getAllResults 
} = require('../controllers/resultController');
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

// Submit result validation
const submitResultValidation = [
  body('examId').notEmpty().withMessage('Exam ID is required'),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*.questionId').notEmpty().withMessage('Question ID is required'),
  body('answers.*.selectedAnswer').optional({ nullable: true }).isNumeric().withMessage('Selected answer must be a number')
];

// @route   POST /api/results
// @desc    Submit exam result
// @access  Private/Student
router.post('/', protect, submitResultValidation, validate, submitResult);

// @route   GET /api/results/student
// @desc    Get student's results
// @access  Private/Student
router.get('/student', protect, getStudentResults);

// @route   GET /api/results/:id
// @desc    Get specific result
// @access  Private
router.get('/:id', protect, getResult);

// @route   GET /api/results/exam/:examId
// @desc    Get results for exam
// @access  Private/Admin
router.get('/exam/:examId', protect, adminMiddleware, getExamResults);

// @route   GET /api/results
// @desc    Get all results
// @access  Private/Admin
router.get('/', protect, adminMiddleware, getAllResults);

module.exports = router;

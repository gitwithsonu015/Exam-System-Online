const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { 
  getExams, 
  getStudentExams, 
  getExam, 
  createExam, 
  updateExam, 
  deleteExam 
} = require('../controllers/examController');
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

// Create exam validation
const createExamValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('duration').custom(value => value > 0).withMessage('Duration must be greater than 0')
];

// Update exam validation
const updateExamValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('duration').optional().isNumeric().withMessage('Duration must be a number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

// @route   GET /api/exams
// @desc    Get all exams
// @access  Private/Admin
router.get('/', protect, adminMiddleware, getExams);

// @route   GET /api/exams/student
// @desc    Get available exams for student
// @access  Private/Student
router.get('/student', protect, getStudentExams);

// @route   GET /api/exams/:id
// @desc    Get single exam
// @access  Private
router.get('/:id', protect, getExam);

// @route   POST /api/exams
// @desc    Create exam
// @access  Private/Admin
router.post('/', protect, adminMiddleware, createExamValidation, validate, createExam);

// @route   PUT /api/exams/:id
// @desc    Update exam
// @access  Private/Admin
router.put('/:id', protect, adminMiddleware, updateExamValidation, validate, updateExam);

// @route   DELETE /api/exams/:id
// @desc    Delete exam
// @access  Private/Admin
router.delete('/:id', protect, adminMiddleware, deleteExam);

module.exports = router;

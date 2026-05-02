const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedAnswer: {
    type: Number,
    min: 0,
    max: 3
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 0
  },
  answers: {
    type: [answerSchema],
    default: []
  },
  timeTaken: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
resultSchema.index({ userId: 1, examId: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);

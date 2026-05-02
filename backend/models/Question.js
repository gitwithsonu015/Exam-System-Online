const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v.length === 4;
      },
      message: 'Exactly 4 options are required'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer is required'],
    min: [0, 'Correct answer must be between 0 and 3'],
    max: [3, 'Correct answer must be between 0 and 3']
  },
  marks: {
    type: Number,
    default: 1,
    min: [1, 'Marks must be at least 1']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);

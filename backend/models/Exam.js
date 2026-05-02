const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for question count
examSchema.virtual('questionCount', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'examId',
  count: true
});

examSchema.set('toJSON', { virtuals: true });
examSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Exam', examSchema);

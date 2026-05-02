const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');

// @desc    Get all exams (admin)
// @route   GET /api/exams
// @access  Private/Admin
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.user._id })
      .populate('createdBy', 'name')
      .sort('-createdAt');
    
    // Get question count for each exam
    const examsWithCount = await Promise.all(
      exams.map(async (exam) => {
        const questionCount = await Question.countDocuments({ examId: exam._id });
        return {
          ...exam.toObject(),
          questionCount
        };
      })
    );

    res.json(examsWithCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available exams (student)
// @route   GET /api/exams/student
// @access  Private/Student
const getStudentExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .select('-createdBy')
      .sort('-createdAt');

    // Get question count for each exam and check if attempted
    const examsWithInfo = await Promise.all(
      exams.map(async (exam) => {
        const questionCount = await Question.countDocuments({ examId: exam._id });
        const result = await Result.findOne({ 
          userId: req.user._id, 
          examId: exam._id 
        });
        
        return {
          ...exam.toObject(),
          questionCount,
          isAttempted: !!result
        };
      })
    );

    res.json(examsWithInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const questionCount = await Question.countDocuments({ examId: exam._id });

    res.json({
      ...exam.toObject(),
      questionCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create exam
// @route   POST /api/exams
// @access  Private/Admin
const createExam = async (req, res) => {
  try {
    const { title, description, duration, totalMarks } = req.body;

    const exam = await Exam.create({
      title,
      description,
      duration,
      totalMarks,
      createdBy: req.user._id
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
const updateExam = async (req, res) => {
  try {
    const { title, description, duration, totalMarks, isActive } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check ownership
    if (exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this exam' });
    }

    exam.title = title || exam.title;
    exam.description = description !== undefined ? description : exam.description;
    exam.duration = duration || exam.duration;
    exam.totalMarks = totalMarks !== undefined ? totalMarks : exam.totalMarks;
    exam.isActive = isActive !== undefined ? isActive : exam.isActive;

    const updatedExam = await exam.save();

    res.json(updatedExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check ownership
    if (exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this exam' });
    }

    // Delete all questions related to this exam
    await Question.deleteMany({ examId: exam._id });

    // Delete all results related to this exam
    await Result.deleteMany({ examId: exam._id });

    await exam.deleteOne();

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExams,
  getStudentExams,
  getExam,
  createExam,
  updateExam,
  deleteExam
};

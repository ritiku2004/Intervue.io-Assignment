import mongoose from 'mongoose';
import shortid from 'shortid';

const answerSchema = mongoose.Schema({
  studentName: { type: String, required: true },
  optionIndex: { type: Number, required: true },
});

const questionSchema = mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  timeLimit: { type: Number, default: 60 },
  answers: [answerSchema],
  correctAnswerIndex: { type: Number, required: true }, // <-- ADD THIS LINE
});

const pollSchema = mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true, default: 'Untitled Poll' },
    joinCode: { type: String, required: true, unique: true, default: shortid.generate },
    questions: [questionSchema],
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Poll = mongoose.model('Poll', pollSchema);
export default Poll;
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },

    // Quest metadata
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'epic'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['health', 'work', 'study', 'chores', 'personal', 'other'],
      default: 'other',
    },

    status: {
      type: String,
      enum: ['active', 'completed', 'missed'],
      default: 'active',
    },

    dueDate: { type: Date },
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly'],
      default: 'none',
    },

    completedAt: { type: Date },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
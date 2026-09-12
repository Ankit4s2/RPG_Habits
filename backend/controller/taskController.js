import Task from "../model/Task.js";
import {
    applyQuestCompletion,
    applyMissedQuestPenalty
} from "../utils/gameLogic.js";

export const getTask = async (req, res)=>{

    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
}

export const createTask = async (req, res)=>{

     try {
        const { title, description, difficulty, category, dueDate, recurrence } = req.body;
        if (!title) return res.status(400).json({ message: 'title is required' });
    
        const task = await Task.create({
        user: req.user._id,
        title,
        description,
        difficulty,
        category,
        dueDate,
        recurrence,
        });
    
        res.status(201).json({ task });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create quest', error: err.message });
    }
}

export const editTask = async (req, res)=>{

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Quest not found' });
    
    const editable = ['title', 'description', 'difficulty', 'category', 'dueDate', 'recurrence'];
    editable.forEach((field) => {
        if (req.body[field] !== undefined) task[field] = req.body[field];
    });
    
    await task.save();
    res.json({ task });
}

export const deleteTask = async (req, res)=>{

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Quest not found' });
    res.json({ message: 'Quest deleted' });
}

export const verifyTaskCompletion = async (req, res)=>{

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Quest not found' });
    if (task.status === 'completed') {
        return res.status(400).json({ message: 'Quest already completed' });
    }

    const user = req.user;
 
    // --- Streak logic: did the user complete a quest yesterday or today already? ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null;
    if (last) last.setHours(0, 0, 0, 0);
    
    if (!last) {
        user.streak = 1;
    } else {
        const dayDiff = Math.round((today - last) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) user.streak += 1; // consecutive day
        else if (dayDiff > 1) user.streak = 1; // streak broken, restart
        // dayDiff === 0 means already completed something today — keep streak as-is
    }
    user.lastCompletedDate = today;
    
    const result = applyQuestCompletion(user, task.difficulty);
    
    task.status = 'completed';
    task.completedAt = new Date();
    
    await Promise.all([user.save(), task.save()]);
    
    res.json({
        task,
        user,
        rewards: result, // { xpGained, goldGained, leveledUp, xpToNext }
    });
}

export const missedTaskPenalty = async (req, res)=>{
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Quest not found' });
    
    const user = req.user;
    const result = applyMissedQuestPenalty(user, task.difficulty);
    
    task.status = 'missed';
    await Promise.all([user.save(), task.save()]);
    
    res.json({ task, user, penalty: result });
}
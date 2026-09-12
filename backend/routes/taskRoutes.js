import express from "express";
import {
    getTask,
    createTask,
    editTask,
    deleteTask,
    verifyTaskCompletion,
    missedTaskPenalty
} from "../controller/taskController.js";

const router = express.Router();

router.get('/', getTask);
router.post('/create', createTask);
router.patch('/:id', editTask);
router.delete('/:id', deleteTask);
router.post('/:id/complete', verifyTaskCompletion);
router.post('/:id/miss', missedTaskPenalty);

export default router;
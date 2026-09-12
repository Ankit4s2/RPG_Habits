import express from "express";
import {
    getTask,
    createTask,
    editTask,
    deleteTask,
    verifyTaskCompletion,
    missedTaskPenalty
} from "../controller/taskController.js";
import {auth} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', auth, getTask);
router.post('/create', auth, createTask);
router.patch('/:id', auth, editTask);
router.delete('/:id', auth, deleteTask);
router.post('/:id/complete', auth, verifyTaskCompletion);
router.post('/:id/miss', auth, missedTaskPenalty);

export default router;
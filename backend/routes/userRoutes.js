import express from "express";
import {
    register,
    login
} from "../controller/userController.js";

const router = express.Router();

router.post('/register', register);
router.get('/login', login);

export default router;
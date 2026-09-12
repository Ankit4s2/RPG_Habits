import express from "express";
import {
    register,
    login,
    getProfile
} from "../controller/userController.js";


const router = express.Router();

router.post('/register', register);
router.get('/login', login);
router.get('/profile', auth, getProfile);

export default router;
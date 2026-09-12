import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const register = async (req, res)=>{
    try {
        const { username, email, password } = req.body;
 
        if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email and password are required' });
        }
 
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
        return res.status(409).json({ message: 'Username or email already in use' });
        }
 
        const user = await User.create({ username, email, password });
        const token = signToken(user._id);
    
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
}

export const login = async (req, res)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
        }
    
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = signToken(user._id);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
}


import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const signToken = (userId) =>
  jwt.sign({ id: userId },
    "mysecretkey", 
    {expiresIn:'5h'}
);

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
 
        const user = await User.create({
            username, 
            email, 
            password: hashedPassword
        });
    
        res.status(201).json({ user });
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

        const token = signToken( user._id);

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
}

export const getProfile = async (req, res)=>{
    try {
        // Populate so the frontend gets full item details, not just ObjectIds
        const user = await User.findById(req.user._id)
        .populate('inventory')
        .populate('avatar.equipped.item');
    
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        const xpNeeded = xpToNextLevel(user.level);
    
        res.json({
        profile: {
            username: user.username,
            email: user.email,
            level: user.level,
            xp: user.xp,
            xpToNext: xpNeeded,
            xpPercent: Math.min(100, Math.round((user.xp / xpNeeded) * 100)),
            gold: user.gold,
            hp: user.hp,
            maxHp: user.maxHp,
            hpPercent: Math.round((user.hp / user.maxHp) * 100),
            streak: user.streak,
            avatar: user.avatar,
            inventory: user.inventory,
            memberSince: user.createdAt,
        },
        });
    }catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
    }
}
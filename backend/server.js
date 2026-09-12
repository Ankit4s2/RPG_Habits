import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import taskRoutes from './routes/taskRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import userRoutes from './routes/userRoutes.js';
 
const app = express();

dotenv.config();
 
connectDB();
 
app.use(cors());
app.use(express.json());
 
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/shop', shopRoutes);
 
app.get('/', (req, res) => {
  res.json({ message: 'Quest Tracker API is running' });
});
 
// Basic error handler fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});
 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
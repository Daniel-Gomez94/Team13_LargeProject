const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Save user progress
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { questionId, code, completed } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update progress
    user.progress.set(questionId.toString(), { code, completed, lastModified: new Date() });
    
    // Add to completed questions if marked as completed
    if (completed && !user.completedQuestions.includes(questionId)) {
      user.completedQuestions.push(questionId);
    }

    await user.save();

    res.json({ message: 'Progress saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress', error: error.message });
  }
});

// Get user progress
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('progress completedQuestions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      progress: Object.fromEntries(user.progress),
      completedQuestions: user.completedQuestions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

// Mark question as completed
router.post('/complete/:questionId', authenticateToken, async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.completedQuestions.includes(questionId)) {
      user.completedQuestions.push(questionId);
      await user.save();
    }

    res.json({ message: 'Question marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking question as completed', error: error.message });
  }
});

module.exports = router;
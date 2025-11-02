const express = require('express');
const router = express.Router();
const axios = require('axios');

// Run C code using Judge0 API
router.post('/run', async (req, res) => {
  try {
    const { source_code, expected_output } = req.body;

    // Submit code to Judge0
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      {
        source_code: source_code,
        language_id: 50 // C (GCC)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      }
    );

    const result = response.data;
    const output = result.stdout || result.stderr || 'No output.';
    
    // Check if output matches expected
    const isCorrect = expected_output ? 
      output.trim() === expected_output.trim() : 
      false;

    res.json({
      output: output,
      stderr: result.stderr,
      time: result.time,
      memory: result.memory,
      status: result.status,
      isCorrect: isCorrect,
      compilation_error: result.compile_output
    });

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ 
      message: 'Error executing code',
      error: error.response?.data || error.message 
    });
  }
});

module.exports = router;
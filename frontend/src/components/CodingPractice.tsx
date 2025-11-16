import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Question, CodeExecutionResult } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CodingPractice: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('Waiting for execution...');
  const [result, setResult] = useState('Not graded yet.');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchQuestions();
    fetchUserProgress();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      loadQuestion(currentQuestionIndex);
    }
  }, [currentQuestionIndex, questions, userProgress]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/progress');
      setUserProgress(response.data.progress || {});
      setCompletedQuestions(new Set(response.data.completedQuestions || []));
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const loadQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    
    const question = questions[index];
    const savedCode = userProgress[question.id]?.code || question.starterCode;
    setCode(savedCode);
    setOutput('Waiting for execution...');
    setResult('Not graded yet.');
  };

  const saveProgress = async (questionId: number, userCode: string, completed: boolean = false) => {
    try {
      await axios.post('/api/progress/save', {
        questionId,
        code: userCode,
        completed
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const runCode = async () => {
    if (!questions[currentQuestionIndex]) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    setExecuting(true);
    setOutput('Compiling and running...');
    setResult('Grading...');

    try {
      // Extract function implementation from user code
      let functionImpl = '';
      const functionName = getFunctionName(currentQuestion.id);
      const regex = getFunctionRegex(currentQuestion.id, functionName);
      const match = code.match(regex);
      
      if (match) {
        functionImpl = match[1].trim();
      }

      // Create complete code by replacing the empty function in fullCode
      const fullCode = currentQuestion.fullCode.replace(
        getEmptyFunctionRegex(currentQuestion.id, functionName),
        `${getFunctionSignature(currentQuestion.id, functionName)} {
${functionImpl}
}`
      );

      const response = await axios.post('/api/code/run', {
        source_code: fullCode,
        expected_output: currentQuestion.expectedOutput
      });

      const executionResult: CodeExecutionResult = response.data;
      setOutput(executionResult.output || 'No output.');

      if (executionResult.isCorrect) {
        setResult('?? Correct! Full credit awarded. Go Knights! ??');
        
        // Mark as completed and save progress
        const newCompleted = new Set(completedQuestions);
        newCompleted.add(currentQuestion.id);
        setCompletedQuestions(newCompleted);
        
        await saveProgress(currentQuestion.id, code, true);
      } else {
        setResult('? Incorrect. Output does not match expected result. Keep trying!');
        await saveProgress(currentQuestion.id, code, false);
      }

    } catch (error: any) {
      setOutput('Error occurred while running code.');
      setResult('? Execution failed. Please check your code.');
      console.error('Code execution error:', error);
    } finally {
      setExecuting(false);
    }
  };

  const resetCode = () => {
    if (questions[currentQuestionIndex]) {
      setCode(questions[currentQuestionIndex].starterCode);
      setOutput('Waiting for execution...');
      setResult('Not graded yet.');
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveProgress(questions[currentQuestionIndex].id, code);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      saveProgress(questions[currentQuestionIndex].id, code);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = code.substring(0, start) + '\t' + code.substring(end);
      setCode(newValue);
      
      // Set cursor position after the tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      }, 0);
    }
  };

  // Helper functions for function extraction
  const getFunctionName = (questionId: number): string => {
    switch (questionId) {
      case 1: return 'mergeAccounts';
      case 2: return 'sumData';
      case 3: return 'battleGame';
      case 4: return 'subsetSum';
      default: return '';
    }
  };

  const getFunctionRegex = (questionId: number, functionName: string): RegExp => {
    switch (questionId) {
      case 1:
        return /account_t\s*\*\s*mergeAccounts\s*\([^)]*\)\s*\{([\s\S]*)\}/;
      case 2:
        return /int\s+sumData\s*\([^)]*\)\s*\{([\s\S]*)\}/;
      case 3:
        return /void\s+battleGame\s*\([^)]*\)\s*\{([\s\S]*)\}/;
      case 4:
        return /int\s+subsetSum\s*\([^)]*\)\s*\{([\s\S]*)\}/;
      default:
        return new RegExp('');
    }
  };

  const getEmptyFunctionRegex = (questionId: number, functionName: string): RegExp => {
    switch (questionId) {
      case 1:
        return /account_t\s*\*\s*mergeAccounts\s*\([^)]*\)\s*\{\s*\}/;
      case 2:
        return /int\s+sumData\s*\([^)]*\)\s*\{\s*\}/;
      case 3:
        return /void\s+battleGame\s*\([^)]*\)\s*\{\s*\}/;
      case 4:
        return /int\s+subsetSum\s*\([^)]*\)\s*\{\s*for\s*\([^)]*\)\s*\{[\s\S]*?\}\s*return\s+0;\s*\}/;
      default:
        return new RegExp('');
    }
  };

  const getFunctionSignature = (questionId: number, functionName: string): string => {
    switch (questionId) {
      case 1:
        return 'account_t * mergeAccounts(account_t * acct1, account_t * acct2)';
      case 2:
        return 'int sumData(treenode* root)';
      case 3:
        return 'void battleGame(queue_t * gameQueue)';
      case 4:
        return 'int subsetSum(int* numbers, int n, int target)';
      default:
        return '';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (completedQuestions.size / questions.length) * 100;

  return (
    <div>
      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Navigation */}
      <div className="question-nav">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => {
              saveProgress(currentQuestion.id, code);
              setCurrentQuestionIndex(index);
            }}
            className={`
              ${index === currentQuestionIndex ? 'active' : ''}
              ${completedQuestions.has(question.id) ? 'completed' : ''}
            `}
          >
            Q{question.id}
          </button>
        ))}
      </div>

      {/* Question Container */}
      <div className="question-container">
        <div className="question">
          <h2>
            <span className="question-number">{currentQuestion.id}</span>
            Question {currentQuestion.id}: {currentQuestion.title}
          </h2>
          <div style={{ whiteSpace: 'pre-line' }}>
            {currentQuestion.description}
          </div>
        </div>
      </div>

      <h2>?? Your Code:</h2>
      <textarea
        className="code-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleTabKey}
        rows={20}
        spellCheck={false}
        placeholder="// Write your C function implementation here..."
      />
      <br />
      <button onClick={runCode} disabled={executing}>
        {executing ? '?? Running...' : '?? Run Code'}
      </button>
      <button onClick={resetCode}>?? Reset</button>

      <h2>?? Output:</h2>
      <div className="output-display">{output}</div>
      
      <h2>?? Result:</h2>
      <div className={`output-display ${result.includes('Correct') ? 'correct' : result.includes('Incorrect') || result.includes('failed') ? 'incorrect' : ''}`}>
        {result}
      </div>

      <div className="question-nav" style={{ marginTop: '30px' }}>
        <button 
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          ?? Previous
        </button>
        <button 
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next ??
        </button>
      </div>
    </div>
  );
};

export default CodingPractice;
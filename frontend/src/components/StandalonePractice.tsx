import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StandalonePractice.css';

interface Question {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  fullCode: string;
  expectedOutput: string;
}

const StandalonePractice: React.FC = () => {
  // Questions database - exactly as in the original JavaScript file
  const questions: Question[] = [
    {
      id: 1,
      title: "DSN (Dynamic Memory Management in C)",
      description: `Consider the following typedef struct definition that represents a basic bank checking account.

//struct representing basic checking account
typedef struct {
    char * name;
    double amount;
    int id;
} account_t;

Complete the following user defined function mergeAccounts. The function will combine two accounts (that were already declared with proper information) into one account. Please note that both structs acct1 and acct2 were both dynamically allocated. You will need to properly allocate a new struct in the heap space that will store the combined information. That means the following is going to happen:
• The names will be merged with acct1 name followed by acct2. Both names will be separated with the word "and". Example let's say acct1 name is "Sonic" and acct2 is "Amy". That means the new account name would be "Sonic and Amy". Make sure there's enough space to hold the total name with the word "and", including the two spaces.
• The amounts will be summed together.
• The id of the merge account will be the original id of acct2.
• No changes should be made to acct1 and acct2.

The function returns the heap address of the new struct.`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
  char * name;
  double amount;
  int id;
} account_t;

account_t * mergeAccounts(account_t * acct1, account_t * acct2) {
  
}`,
      fullCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
  char * name;
  double amount;
  int id;
} account_t;

account_t * mergeAccounts(account_t * acct1, account_t * acct2) {
  
}

int main() {
  account_t * a = malloc(sizeof(account_t));
  account_t * b = malloc(sizeof(account_t));
  a->name = strdup("Sonic");
  a->amount = 100.0;
  a->id = 1;
  b->name = strdup("Amy");
  b->amount = 150.0;
  b->id = 2;

  account_t * merged = mergeAccounts(a, b);
  printf("%s\\n%.2f\\n%d\\n", merged->name, merged->amount, merged->id);
  return 0;
}`,
      expectedOutput: "Sonic and Amy\n250.00\n2\n"
    },
    {
      id: 2,
      title: "DSN (Binary Tree Recursive Sum)",
      description: `A binary tree is stored using the struct definition below. Write a recursive function that returns the sum of the data values stored in the tree pointed to by the parameter root.

typedef struct treenode {
    int data;
    struct treenode *left;
    struct treenode *right;
} treenode;

Complete the recursive function sumData that:
• Takes a pointer to the root of a binary tree
• Returns the sum of all data values in the tree
• Uses recursion to traverse the tree
• Returns 0 if the tree is empty (root is NULL)`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct treenode {
    int data;
    struct treenode *left;
    struct treenode *right;
} treenode;

int sumData(treenode* root) {
    
}`,
      fullCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct treenode {
    int data;
    struct treenode *left;
    struct treenode *right;
} treenode;

int sumData(treenode* root) {
    
}

treenode* createNode(int data) {
    treenode* node = malloc(sizeof(treenode));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

int main() {
    // Create a simple binary tree:
    //       5
    //      / \\
    //     3   8
    //    / \\   \\
    //   2   4   9
    treenode* root = createNode(5);
    root->left = createNode(3);
    root->right = createNode(8);
    root->left->left = createNode(2);
    root->left->right = createNode(4);
    root->right->right = createNode(9);
    
    int sum = sumData(root);
    printf("%d\\n", sum);
    return 0;
}`,
      expectedOutput: "31\n"
    },
    {
      id: 3,
      title: "DSN (Queues)",
      description: `We are going to simulate a simple battle game involving players in a queue. The battle game has the following rules:
• The game involves several battles. Each battle will involve the two front players in the queue.
• The winner of the battle is determined by figuring out who has more hp. In the case that both players have the same hp, the second player in line is the winner of the round.
• The loser of the game is removed completely and the winner is added to the back of the queue.
• The game is over when there is 1 player remaining in the queue.

Complete the following function battleGame that simulates this game. You are provided with helper functions that have been implemented already. You must utilize them reasonably for full credit. The function should print the name of the player that won the game. It is guaranteed that the queue pointed to by gameQueue has at least one player in it.

Helper functions provided:
• void enqueue(queue_t* gameQueue, player_t* player) - enqueues player to gameQueue
• player_t* dequeue(queue_t* gameQueue) - removes front node, returns ptr to it
• player_t* front(queue_t* gameQueue) - returns pointer to front node
• void deletePlayer(player_t* player) - frees memory pointed to by player`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct player_s {
    char * name;
    int hp;
    struct player_s* next;
} player_t;

typedef struct {
    player_t* front;
    player_t* back;
    int size;
} queue_t;

void enqueue(queue_t* gameQueue, player_t* player);
int size(queue_t* gameQueue);
player_t* dequeue(queue_t* gameQueue);
player_t* front(queue_t* gameQueue);
void deletePlayer(player_t* player);

void battleGame(queue_t * gameQueue) {
    
}`,
      fullCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct player_s {
    char * name;
    int hp;
    struct player_s* next;
} player_t;

typedef struct {
    player_t* front;
    player_t* back;
    int size;
} queue_t;

void enqueue(queue_t* gameQueue, player_t* player) {
    if (gameQueue->size == 0) {
        gameQueue->front = player;
        gameQueue->back = player;
    } else {
        gameQueue->back->next = player;
        gameQueue->back = player;
    }
    player->next = NULL;
    gameQueue->size++;
}

int size(queue_t* gameQueue) {
    return gameQueue->size;
}

player_t* dequeue(queue_t* gameQueue) {
    if (gameQueue->size == 0) return NULL;
    player_t* temp = gameQueue->front;
    gameQueue->front = gameQueue->front->next;
    gameQueue->size--;
    if (gameQueue->size == 0) {
        gameQueue->back = NULL;
    }
    temp->next = NULL;
    return temp;
}

player_t* front(queue_t* gameQueue) {
    return gameQueue->front;
}

void deletePlayer(player_t* player) {
    if (player) {
        free(player->name);
        free(player);
    }
}

void battleGame(queue_t * gameQueue) {
    
}

player_t* createPlayer(char* name, int hp) {
    player_t* player = malloc(sizeof(player_t));
    player->name = strdup(name);
    player->hp = hp;
    player->next = NULL;
    return player;
}

int main() {
    queue_t* gameQueue = malloc(sizeof(queue_t));
    gameQueue->front = NULL;
    gameQueue->back = NULL;
    gameQueue->size = 0;
    
    // Add players to queue
    enqueue(gameQueue, createPlayer("Alice", 100));
    enqueue(gameQueue, createPlayer("Bob", 80));
    enqueue(gameQueue, createPlayer("Charlie", 120));
    enqueue(gameQueue, createPlayer("Diana", 90));
    
    battleGame(gameQueue);
    return 0;
}`,
      expectedOutput: "Charlie is the winner.\n"
    },
    {
      id: 4,
      title: "DSN (Bitwise Operators)",
      description: `Complete the function below, using the appropriate bitwise operators when necessary, so that it returns 1 if the array, numbers (first parameter to the function) contains a subset of values that adds up exactly to target (third parameter to the function). Note that the second parameter, n, represents the length of the array numbers. If no such subset exists, then the function should return 0.

The function uses bitwise operations to generate all possible subsets of the array. For each subset represented by the binary representation of i, you need to:
• Check each bit position to see if that array element should be included in the current subset
• Calculate the sum of elements in the current subset
• Check if the sum equals the target value

Use bitwise AND (&) and bit shifting (<<) operations to determine which elements to include in each subset.`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>

int subsetSum(int* numbers, int n, int target) {
    for (int i = 0; i < (1 << n); i++) {
        //=====Your Code Goes Here=====
        
    }
    return 0;
}`,
      fullCode: `#include <stdio.h>
#include <stdlib.h>

int subsetSum(int* numbers, int n, int target) {
    for (int i = 0; i < (1 << n); i++) {
        //=====Your Code Goes Here=====
        
    }
    return 0;
}

int main() {
    // Test case 1: Array {3, 34, 4, 12, 5, 2}, target = 9
    // Expected: 1 (subset {4, 5} sums to 9)
    int numbers1[] = {3, 34, 4, 12, 5, 2};
    int result1 = subsetSum(numbers1, 6, 9);
    printf("%d\\n", result1);
    
    // Test case 2: Array {3, 34, 4, 12, 5, 2}, target = 30
    // Expected: 0 (no subset sums to 30)
    int numbers2[] = {3, 34, 4, 12, 5, 2};
    int result2 = subsetSum(numbers2, 6, 30);
    printf("%d\\n", result2);
    
    return 0;
}`,
      expectedOutput: "1\n0\n"
    }
  ];

  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [userProgress, setUserProgress] = useState<Record<number, { code: string }>>({});
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('Waiting for execution...');
  const [result, setResult] = useState('Not graded yet.');
  const [isExecuting, setIsExecuting] = useState(false);

  // Initialize component
  useEffect(() => {
    loadQuestion(currentQuestionIndex);
    loadSavedProgress();
  }, []);

  // Update question when index changes
  useEffect(() => {
    loadQuestion(currentQuestionIndex);
  }, [currentQuestionIndex, userProgress]);

  // Load a specific question
  const loadQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    
    const question = questions[index];
    
    // Load saved code or starter code
    const savedCode = userProgress[question.id]?.code || question.starterCode;
    setCode(savedCode);
    
    // Clear output and result
    setOutput('Waiting for execution...');
    setResult('Not graded yet.');
  };

  // Save current progress to localStorage
  const saveCurrentProgress = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newProgress = {
      ...userProgress,
      [currentQuestion.id]: { code }
    };
    setUserProgress(newProgress);
    localStorage.setItem("ucf_coding_progress", JSON.stringify(newProgress));
  };

  // Load saved progress from localStorage
  const loadSavedProgress = () => {
    const saved = localStorage.getItem("ucf_coding_progress");
    if (saved) {
      try {
        const parsedProgress = JSON.parse(saved);
        setUserProgress(parsedProgress);
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
    
    const savedCompleted = localStorage.getItem("ucf_completed_questions");
    if (savedCompleted) {
      try {
        const parsedCompleted = JSON.parse(savedCompleted);
        setCompletedQuestions(new Set(parsedCompleted));
      } catch (error) {
        console.error('Error parsing completed questions:', error);
      }
    }
  };

  // Update progress bar calculation
  const progressPercentage = (completedQuestions.size / questions.length) * 100;

  // Navigation functions
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentProgress();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      saveCurrentProgress();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to specific question
  const navigateToQuestion = (index: number) => {
    saveCurrentProgress();
    setCurrentQuestionIndex(index);
  };

  // Reset code to starter code
  const resetCode = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setCode(currentQuestion.starterCode);
    setOutput('Waiting for execution...');
    setResult('Not graded yet.');
  };

  // Handle tab key in textarea for better code editing
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

  // Run code and grade it using Judge0 API
  const runCode = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    setIsExecuting(true);
    setOutput('Compiling and running...');
    setResult('Grading...');

    try {
      // Extract the function implementation from user code
      let functionImpl = '';
      if (currentQuestion.id === 1) {
        // For mergeAccounts function
        const match = code.match(/account_t\s*\*\s*mergeAccounts\s*\([^)]*\)\s*\{([\s\S]*)\}/);
        if (match) {
          functionImpl = match[1].trim();
        }
      } else if (currentQuestion.id === 2) {
        // For sumData function
        const match = code.match(/int\s+sumData\s*\([^)]*\)\s*\{([\s\S]*)\}/);
        if (match) {
          functionImpl = match[1].trim();
        }
      } else if (currentQuestion.id === 3) {
        // For battleGame function
        const match = code.match(/void\s+battleGame\s*\([^)]*\)\s*\{([\s\S]*)\}/);
        if (match) {
          functionImpl = match[1].trim();
        }
      } else if (currentQuestion.id === 4) {
        // For subsetSum function
        const match = code.match(/int\s+subsetSum\s*\([^)]*\)\s*\{([\s\S]*)\}/);
        if (match) {
          functionImpl = match[1].trim();
        }
      }

      // Create the complete code by replacing the empty function in fullCode
      let fullCode = currentQuestion.fullCode;
      if (currentQuestion.id === 1) {
        fullCode = fullCode.replace(
          /account_t\s*\*\s*mergeAccounts\s*\([^)]*\)\s*\{\s*\}/,
          `account_t * mergeAccounts(account_t * acct1, account_t * acct2) {\n${functionImpl}\n}`
        );
      } else if (currentQuestion.id === 2) {
        fullCode = fullCode.replace(
          /int\s+sumData\s*\([^)]*\)\s*\{\s*\}/,
          `int sumData(treenode* root) {\n${functionImpl}\n}`
        );
      } else if (currentQuestion.id === 3) {
        fullCode = fullCode.replace(
          /void\s+battleGame\s*\([^)]*\)\s*\{\s*\}/,
          `void battleGame(queue_t * gameQueue) {\n${functionImpl}\n}`
        );
      } else if (currentQuestion.id === 4) {
        fullCode = fullCode.replace(
          /int\s+subsetSum\s*\([^)]*\)\s*\{\s*for\s*\([^)]*\)\s*\{[\s\S]*?\}\s*return\s+0;\s*\}/,
          `int subsetSum(int* numbers, int n, int target) {\n${functionImpl}\n}`
        );
      }

      // Call Judge0 API
      const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "7f086cd239msh46b973a3ab8a5d8p12c5d8jsn6cb22918b98c", // Replace with your RapidAPI key
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        },
        body: JSON.stringify({
          source_code: fullCode,
          language_id: 50 // C (GCC)
        })
      });

      const resultData = await response.json();
      const outputText = resultData.stdout || resultData.stderr || "No output.";
      setOutput(outputText);

      // Grade the solution
      const expected = currentQuestion.expectedOutput;

      if (outputText.trim() === expected.trim()) {
        setResult('?? Correct! Full credit awarded. Go Knights! ??');
        
        // Mark as completed and save to localStorage
        const newCompleted = new Set(completedQuestions);
        newCompleted.add(currentQuestion.id);
        setCompletedQuestions(newCompleted);
        localStorage.setItem("ucf_completed_questions", JSON.stringify(Array.from(newCompleted)));
      } else {
        setResult('? Incorrect. Output does not match expected result. Keep trying!');
      }

      // Save progress after running
      saveCurrentProgress();

    } catch (error) {
      setOutput('Error occurred while running code.');
      setResult('? Execution failed. Please check your code.');
      console.error("Error:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="standalone-practice">
      {/* Navigation back to main app */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        <Link to="/">
          <button type="button" style={{ fontSize: '12px', padding: '5px 10px' }}>
            Back to Main App
          </button>
        </Link>
      </div>

      <h1>
        <span className="ucf-accent">??</span>
        UCF Computer Science Foundations Practice
        <span className="ucf-accent">??</span>
      </h1>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question Navigation */}
      <div className="question-nav">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => navigateToQuestion(index)}
            className={`nav-button ${index === currentQuestionIndex ? 'active' : ''} ${completedQuestions.has(question.id) ? 'completed' : ''}`}
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
        id="code"
        rows={20}
        spellCheck={false}
        placeholder="// Write your C function implementation here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleTabKey}
      />
      <br />
      <button onClick={runCode} disabled={isExecuting}>
        {isExecuting ? '?? Running...' : '?? Run Code'}
      </button>
      <button onClick={resetCode}>?? Reset</button>

      <h2>?? Output:</h2>
      <pre className="output">{output}</pre>
      
      <h2>?? Result:</h2>
      <pre className={`result ${result.includes('Correct') ? 'correct' : result.includes('Incorrect') || result.includes('failed') ? 'incorrect' : ''}`}>
        {result}
      </pre>

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

export default StandalonePractice;
// Questions database
const questions = [
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

// Global variables
let currentQuestionIndex = 0;
let completedQuestions = new Set();
let userProgress = {}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    setupTabSupport();
    loadQuestion(currentQuestionIndex);
    createQuestionNavigation();
    updateProgressBar();
    loadSavedProgress();
});

// Enable tab key in textarea
function setupTabSupport() {
    const editor = document.getElementById("code");
    editor.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
        }
    });
}

// Load a specific question
function loadQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    currentQuestionIndex = index;
    const question = questions[index];
    
    // Update question container
    const container = document.getElementById("questionContainer");
    container.innerHTML = `
        <div class="question">
            <h2><span class="question-number">${question.id}</span>Question ${question.id}: ${question.title}</h2>
            <div style="white-space: pre-line;">${question.description}</div>
        </div>
    `;
    
    // Load saved code or starter code (without main method)
    const savedCode = userProgress[question.id]?.code || question.starterCode;
    document.getElementById("code").value = savedCode;
    
    // Clear output and result
    document.getElementById("output").textContent = "Waiting for execution...";
    document.getElementById("result").textContent = "Not graded yet.";
    
    // Update navigation
    updateQuestionNavigation();
}

// Create question navigation buttons
function createQuestionNavigation() {
    const nav = document.getElementById("questionNav");
    nav.innerHTML = "";
    
    questions.forEach((question, index) => {
        const button = document.createElement("button");
        button.textContent = `Q${question.id}`;
        button.onclick = () => loadQuestion(index);
        button.id = `nav-btn-${index}`;
        nav.appendChild(button);
    });
    
    updateQuestionNavigation();
}

// Update navigation button states
function updateQuestionNavigation() {
    questions.forEach((question, index) => {
        const button = document.getElementById(`nav-btn-${index}`);
        if (button) {
            button.classList.remove("active", "completed");
            
            if (index === currentQuestionIndex) {
                button.classList.add("active");
            }
            
            if (completedQuestions.has(question.id)) {
                button.classList.add("completed");
            }
        }
    });
}

// Update progress bar
function updateProgressBar() {
    const progress = (completedQuestions.size / questions.length) * 100;
    document.getElementById("progressFill").style.width = `${progress}%`;
}

// Navigation functions
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        saveCurrentProgress();
        loadQuestion(currentQuestionIndex - 1);
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        saveCurrentProgress();
        loadQuestion(currentQuestionIndex + 1);
    }
}

// Save current progress
function saveCurrentProgress() {
    const currentQuestion = questions[currentQuestionIndex];
    const code = document.getElementById("code").value;
    
    if (!userProgress[currentQuestion.id]) {
        userProgress[currentQuestion.id] = {};
    }
    
    userProgress[currentQuestion.id].code = code;
    localStorage.setItem("ucf_coding_progress", JSON.stringify(userProgress));
}

// Load saved progress
function loadSavedProgress() {
    const saved = localStorage.getItem("ucf_coding_progress");
    if (saved) {
        userProgress = JSON.parse(saved);
    }
    
    const savedCompleted = localStorage.getItem("ucf_completed_questions");
    if (savedCompleted) {
        completedQuestions = new Set(JSON.parse(savedCompleted));
        updateProgressBar();
        updateQuestionNavigation();
    }
}

// Reset code function - now resets immediately without confirmation
function resetCode() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("code").value = currentQuestion.starterCode;
    
    // Clear output and result when resetting
    document.getElementById("output").textContent = "Waiting for execution...";
    document.getElementById("result").textContent = "Not graded yet.";
}

// Run code and grade it
async function runCode() {
    const userCode = document.getElementById("code").value;
    const currentQuestion = questions[currentQuestionIndex];

    // Extract the function implementation from user code
    let functionImpl = "";
    if (currentQuestion.id === 1) {
        // For mergeAccounts function
        const match = userCode.match(/account_t\\s*\\*\\s*mergeAccounts\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*)\\}/);
        if (match) {
            functionImpl = match[1].trim();
        }
    } else if (currentQuestion.id === 2) {
        // For sumData function
        const match = userCode.match(/int\\s+sumData\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*)\\}/);
        if (match) {
            functionImpl = match[1].trim();
        }
    } else if (currentQuestion.id === 3) {
        // For battleGame function
        const match = userCode.match(/void\\s+battleGame\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*)\\}/);
        if (match) {
            functionImpl = match[1].trim();
        }
    } else if (currentQuestion.id === 4) {
        // For subsetSum function - Fixed regex to properly capture function body
        const match = userCode.match(/int\\s+subsetSum\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*)\\}/);
        if (match) {
            functionImpl = match[1].trim();
        }
    }

    // Create the complete code by replacing the empty function in fullCode
    let fullCode = currentQuestion.fullCode;
    if (currentQuestion.id === 1) {
        fullCode = fullCode.replace(
            /account_t\\s*\\*\\s*mergeAccounts\\s*\\([^)]*\\)\\s*\\{\\s*\\}/,
            `account_t * mergeAccounts(account_t * acct1, account_t * acct2) {\\n${functionImpl}\\n}`
        );
    } else if (currentQuestion.id === 2) {
        fullCode = fullCode.replace(
            /int\\s+sumData\\s*\\([^)]*\\)\\s*\\{\\s*\\}/,
            `int sumData(treenode* root) {\\n${functionImpl}\\n}`
        );
    } else if (currentQuestion.id === 3) {
        fullCode = fullCode.replace(
            /void\\s+battleGame\\s*\\([^)]*\\)\\s*\\{\\s*\\}/,
            `void battleGame(queue_t * gameQueue) {\\n${functionImpl}\\n}`
        );
    } else if (currentQuestion.id === 4) {
        // Fixed regex pattern to match the empty function properly
        fullCode = fullCode.replace(
            /int\\s+subsetSum\\s*\\([^)]*\\)\\s*\\{\\s*for\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\}\\s*return\\s+0;\\s*\\}/,
            `int subsetSum(int* numbers, int n, int target) {\\n${functionImpl}\\n}`
        );
    }

    const output = document.getElementById("output");
    const result = document.getElementById("result");

    output.textContent = "Compiling and running...";
    result.textContent = "Grading...";

    try {
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
        output.textContent = outputText;

        // Grade the solution
        const expected = currentQuestion.expectedOutput;

        if (outputText.trim() === expected.trim()) {
            result.innerHTML = "<span class='correct'>🎉 Correct! Full credit awarded. Go Knights! ⚔️</span>";
            completedQuestions.add(currentQuestion.id);
            localStorage.setItem("ucf_completed_questions", JSON.stringify([...completedQuestions]));
            updateProgressBar();
            updateQuestionNavigation();
        } else {
            result.innerHTML = "<span class='incorrect'>❌ Incorrect. Output does not match expected result. Keep trying!</span>";
        }

        // Save progress after running
        saveCurrentProgress();

    } catch (error) {
        output.textContent = "Error occurred while running code.";
        result.innerHTML = "<span class='incorrect'>❌ Execution failed. Please check your code.</span>";
        console.error("Error:", error);
    }
}
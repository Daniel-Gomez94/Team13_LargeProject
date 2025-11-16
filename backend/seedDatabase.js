const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

// Sample questions data from the original JavaScript file
const questionsData = [
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

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ucf_coding_practice');
        console.log('Connected to MongoDB');

        // Clear existing questions
        await Question.deleteMany({});
        console.log('Cleared existing questions');

        // Insert new questions
        await Question.insertMany(questionsData);
        console.log('Questions inserted successfully');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
export interface Challenge {
    id: number;
    title: string;
    description: string;
    type: string; // Challenge type (e.g., 'DSN' for Data Structures)
    testCases: { input: string; expected: string }[];
    starterCode: string;
    editableRegion?: { start: number; end: number }; // Line numbers for editable region
}

export const challenges: Challenge[] = [
    {
        id: 1,
        title: "Merge Bank Accounts (Dynamic Memory)",
        description: "Complete the mergeAccounts function that combines two bank accounts into one. The function must:\n- Merge names with 'and' between them (e.g., 'Sonic and Amy')\n- Sum the amounts together\n- Use acct2's id for the merged account\n- Dynamically allocate memory for the new account\n- Not modify the original accounts\n\nThe function should return a pointer to the newly allocated merged account.",
        type: "DSN",
        starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char * name;
    double amount;
    int id;
} account_t;

account_t * mergeAccounts(account_t * acct1, account_t * acct2) {
    // Your code here
}`,
        editableRegion: { start: 11, end: 13 }, // Lines 11-13 are editable (inside the function)
        testCases: [
            { 
                input: "Sonic\n100.50\n1001\nAmy\n200.75\n1002", 
                expected: "Sonic and Amy\n301.25\n1002" 
            },
            { 
                input: "Alice\n500.00\n2001\nBob\n250.50\n2002", 
                expected: "Alice and Bob\n750.50\n2002" 
            },
            { 
                input: "John\n1000.00\n3001\nJane\n1500.00\n3002", 
                expected: "John and Jane\n2500.00\n3002" 
            }
        ]
    },
    {
        id: 2,
        title: "Battle Game (Queues)",
        description: "Simulate a simple battle game involving players in a queue. The battle game has the following rules:\n- The game involves several battles. Each battle will involve the two front players in the queue.\n- The winner of the battle is determined by who has more hp. If both players have the same hp, the second player in line wins.\n- The loser is removed completely and the winner is added to the back of the queue.\n- The game is over when there is 1 player remaining in the queue.\n\nComplete the battleGame function that simulates this game and prints the name of the winner.",
        type: "DSN",
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
player_t* front(queue_t * gameQueue);
void deletePlayer(player_t * player);

void battleGame(queue_t * gameQueue) {
    // Your code here
}`,
        editableRegion: { start: 23, end: 25 },
        testCases: [
            {
                input: "3\nAlice\n100\nBob\n80\nCharlie\n120",
                expected: "Charlie"
            },
            {
                input: "4\nWarrior\n150\nMage\n120\nRogue\n150\nTank\n200",
                expected: "Tank"
            },
            {
                input: "5\nKnight\n100\nArcher\n90\nWizard\n100\nBerserker\n110\nHealer\n85",
                expected: "Berserker"
            }
        ]
    }
];

// Hidden main functions for each challenge
export const hiddenMains: { [key: number]: string } = {
    1: `
int main() {
    // Allocate and initialize first account
    account_t *acct1 = (account_t*)malloc(sizeof(account_t));
    acct1->name = (char*)malloc(100 * sizeof(char));
    scanf("%s", acct1->name);
    scanf("%lf", &acct1->amount);
    scanf("%d", &acct1->id);
    
    // Allocate and initialize second account
    account_t *acct2 = (account_t*)malloc(sizeof(account_t));
    acct2->name = (char*)malloc(100 * sizeof(char));
    scanf("%s", acct2->name);
    scanf("%lf", &acct2->amount);
    scanf("%d", &acct2->id);
    
    // Call student's function
    account_t *merged = mergeAccounts(acct1, acct2);
    
    // Print results
    if (merged != NULL) {
        printf("%s\\n", merged->name);
        printf("%.2f\\n", merged->amount);
        printf("%d\\n", merged->id);
        
        // Free allocated memory
        free(merged->name);
        free(merged);
    }
    
    free(acct1->name);
    free(acct1);
    free(acct2->name);
    free(acct2);
    
    return 0;
}`,
    2: `
// Helper function implementations
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
    if (player != NULL) {
        free(player->name);
        free(player);
    }
}

int main() {
    int n;
    scanf("%d", &n);
    
    queue_t* gameQueue = (queue_t*)malloc(sizeof(queue_t));
    gameQueue->front = NULL;
    gameQueue->back = NULL;
    gameQueue->size = 0;
    
    // Read players and enqueue them
    for (int i = 0; i < n; i++) {
        player_t* player = (player_t*)malloc(sizeof(player_t));
        player->name = (char*)malloc(100 * sizeof(char));
        scanf("%s", player->name);
        scanf("%d", &player->hp);
        player->next = NULL;
        enqueue(gameQueue, player);
    }
    
    // Run the battle game
    battleGame(gameQueue);
    
    // Clean up remaining player
    if (gameQueue->size > 0) {
        player_t* winner = dequeue(gameQueue);
        deletePlayer(winner);
    }
    free(gameQueue);
    
    return 0;
}`
};

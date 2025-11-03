export interface Challenge {
    id: number;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    testCases: { input: string; expected: string }[];
    starterCode: string;
    editableRegion?: { start: number; end: number }; // Line numbers for editable region
}

export const challenges: Challenge[] = [
    {
        id: 1,
        title: "Merge Bank Accounts (Dynamic Memory)",
        description: "Complete the mergeAccounts function that combines two bank accounts into one. The function must:\n\u2022 Merge names with 'and' between them (e.g., 'Sonic and Amy')\n\u2022 Sum the amounts together\n\u2022 Use acct2's id for the merged account\n\u2022 Dynamically allocate memory for the new account\n\u2022 Not modify the original accounts\n\nThe function should return a pointer to the newly allocated merged account.",
        difficulty: "Medium",
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
}`
};

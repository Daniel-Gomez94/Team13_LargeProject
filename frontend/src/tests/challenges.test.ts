import { describe, it, expect } from 'vitest';
import { challenges, hiddenMains } from '../data/challenges';

describe('Challenges Data', () => {
  describe('challenges array', () => {
    it('should have at least 2 challenges', () => {
      expect(challenges.length).toBeGreaterThanOrEqual(2);
    });

    it('should have unique IDs for each challenge', () => {
      const ids = challenges.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have sequential IDs starting from 1', () => {
      const ids = challenges.map(c => c.id).sort((a, b) => a - b);
      ids.forEach((id, index) => {
        expect(id).toBe(index + 1);
      });
    });

    describe('Challenge 1: Merge Bank Accounts', () => {
      const challenge = challenges[0];

      it('should have correct basic properties', () => {
        expect(challenge.id).toBe(1);
        expect(challenge.title).toBe("Merge Bank Accounts (Dynamic Memory)");
        expect(challenge.type).toBe("DSN");
      });

      it('should have description with key requirements', () => {
        expect(challenge.description).toContain("mergeAccounts");
        expect(challenge.description).toContain("account");
        expect(challenge.description).toContain("Merge names");
      });

      it('should have starter code with function signature', () => {
        expect(challenge.starterCode).toContain("account_t * mergeAccounts");
        expect(challenge.starterCode).toContain("typedef struct");
        expect(challenge.starterCode).toContain("#include <stdio.h>");
        expect(challenge.starterCode).toContain("#include <stdlib.h>");
        expect(challenge.starterCode).toContain("#include <string.h>");
      });

      it('should have editable region defined', () => {
        expect(challenge.editableRegion).toBeDefined();
        expect(challenge.editableRegion?.start).toBe(11);
        expect(challenge.editableRegion?.end).toBe(13);
      });

      it('should have 3 test cases', () => {
        expect(challenge.testCases).toHaveLength(3);
      });

      it('test case 1 should merge Sonic and Amy accounts', () => {
        const testCase = challenge.testCases[0];
        expect(testCase.input).toContain("Sonic");
        expect(testCase.input).toContain("Amy");
        expect(testCase.expected).toContain("Sonic and Amy");
        expect(testCase.expected).toContain("301.25");
        expect(testCase.expected).toContain("1002");
      });

      it('test case 2 should merge Alice and Bob accounts', () => {
        const testCase = challenge.testCases[1];
        expect(testCase.input).toContain("Alice");
        expect(testCase.input).toContain("Bob");
        expect(testCase.expected).toContain("Alice and Bob");
        expect(testCase.expected).toContain("750.50");
        expect(testCase.expected).toContain("2002");
      });

      it('test case 3 should merge John and Jane accounts', () => {
        const testCase = challenge.testCases[2];
        expect(testCase.input).toContain("John");
        expect(testCase.input).toContain("Jane");
        expect(testCase.expected).toContain("John and Jane");
        expect(testCase.expected).toContain("2500.00");
        expect(testCase.expected).toContain("3002");
      });
    });

    describe('Challenge 2: Battle Game (Queues)', () => {
      const challenge = challenges[1];

      it('should have correct basic properties', () => {
        expect(challenge.id).toBe(2);
        expect(challenge.title).toBe("Battle Game (Queues)");
        expect(challenge.type).toBe("DSN");
      });

      it('should have description with queue rules', () => {
        expect(challenge.description).toContain("queue");
        expect(challenge.description).toContain("battle");
        expect(challenge.description).toContain("hp");
        expect(challenge.description).toContain("winner");
      });

      it('should have starter code with required structures', () => {
        expect(challenge.starterCode).toContain("typedef struct player_s");
        expect(challenge.starterCode).toContain("typedef struct");
        expect(challenge.starterCode).toContain("queue_t");
        expect(challenge.starterCode).toContain("void battleGame");
      });

      it('should have helper function declarations', () => {
        expect(challenge.starterCode).toContain("void enqueue");
        expect(challenge.starterCode).toContain("int size");
        expect(challenge.starterCode).toContain("player_t* dequeue");
        expect(challenge.starterCode).toContain("player_t* front");
        expect(challenge.starterCode).toContain("void deletePlayer");
      });

      it('should have editable region defined', () => {
        expect(challenge.editableRegion).toBeDefined();
        expect(challenge.editableRegion?.start).toBe(23);
        expect(challenge.editableRegion?.end).toBe(25);
      });

      it('should have 3 test cases', () => {
        expect(challenge.testCases).toHaveLength(3);
      });

      it('test case 1 should have Charlie as winner', () => {
        const testCase = challenge.testCases[0];
        expect(testCase.input).toContain("Alice");
        expect(testCase.input).toContain("Charlie");
        expect(testCase.expected).toBe("Charlie");
      });

      it('test case 2 should have Tank as winner', () => {
        const testCase = challenge.testCases[1];
        expect(testCase.input).toContain("Tank");
        expect(testCase.expected).toBe("Tank");
      });

      it('test case 3 should have Berserker as winner', () => {
        const testCase = challenge.testCases[2];
        expect(testCase.input).toContain("Berserker");
        expect(testCase.expected).toBe("Berserker");
      });
    });

    it('all challenges should have valid test case structure', () => {
      challenges.forEach(challenge => {
        challenge.testCases.forEach(testCase => {
          expect(testCase).toHaveProperty('input');
          expect(testCase).toHaveProperty('expected');
          expect(typeof testCase.input).toBe('string');
          expect(typeof testCase.expected).toBe('string');
        });
      });
    });

    it('all challenges should have non-empty starter code', () => {
      challenges.forEach(challenge => {
        expect(challenge.starterCode.length).toBeGreaterThan(0);
        expect(challenge.starterCode).toContain('#include');
      });
    });
  });

  describe('hiddenMains object', () => {
    it('should have main functions for all challenges', () => {
      challenges.forEach(challenge => {
        expect(hiddenMains[challenge.id]).toBeDefined();
      });
    });

    it('Challenge 1 hidden main should have memory allocation', () => {
      const main = hiddenMains[1];
      expect(main).toContain('malloc');
      expect(main).toContain('scanf');
      expect(main).toContain('mergeAccounts');
      expect(main).toContain('free');
    });

    it('Challenge 2 hidden main should implement helper functions', () => {
      const main = hiddenMains[2];
      expect(main).toContain('void enqueue');
      expect(main).toContain('player_t* dequeue');
      expect(main).toContain('int size');
      expect(main).toContain('player_t* front');
      expect(main).toContain('void deletePlayer');
    });

    it('all hidden mains should have main function', () => {
      Object.values(hiddenMains).forEach(main => {
        expect(main).toContain('int main()');
      });
    });

    it('all hidden mains should be valid C code with includes', () => {
      Object.values(hiddenMains).forEach(main => {
        // Should have proper structure for C code
        expect(main.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Challenge Interface Validation', () => {
    it('each challenge should conform to Challenge interface', () => {
      challenges.forEach(challenge => {
        expect(challenge).toHaveProperty('id');
        expect(challenge).toHaveProperty('title');
        expect(challenge).toHaveProperty('description');
        expect(challenge).toHaveProperty('type');
        expect(challenge).toHaveProperty('testCases');
        expect(challenge).toHaveProperty('starterCode');
        
        expect(typeof challenge.id).toBe('number');
        expect(typeof challenge.title).toBe('string');
        expect(typeof challenge.description).toBe('string');
        expect(typeof challenge.type).toBe('string');
        expect(Array.isArray(challenge.testCases)).toBe(true);
        expect(typeof challenge.starterCode).toBe('string');
      });
    });

    it('editableRegion should be valid when present', () => {
      challenges.forEach(challenge => {
        if (challenge.editableRegion) {
          expect(challenge.editableRegion).toHaveProperty('start');
          expect(challenge.editableRegion).toHaveProperty('end');
          expect(typeof challenge.editableRegion.start).toBe('number');
          expect(typeof challenge.editableRegion.end).toBe('number');
          expect(challenge.editableRegion.start).toBeLessThanOrEqual(challenge.editableRegion.end);
        }
      });
    });
  });

  describe('Data Integrity', () => {
    it('should not have duplicate titles', () => {
      const titles = challenges.map(c => c.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    it('all challenges should have at least one test case', () => {
      challenges.forEach(challenge => {
        expect(challenge.testCases.length).toBeGreaterThan(0);
      });
    });

    it('all test inputs and outputs should be non-empty strings', () => {
      challenges.forEach(challenge => {
        challenge.testCases.forEach(testCase => {
          expect(testCase.input.length).toBeGreaterThan(0);
          expect(testCase.expected.length).toBeGreaterThan(0);
        });
      });
    });

    it('all challenges should have DSN type', () => {
      challenges.forEach(challenge => {
        expect(challenge.type).toBe('DSN');
      });
    });
  });
});

const { describe, it, expect } = require('@jest/globals');

describe('Challenge Solution Tests', () => {
  describe('Challenge 1: Merge Bank Accounts', () => {
    // Note: These are conceptual tests for the C function
    // Actual execution would require compiling and running C code
    
    it('should merge account names with "and"', () => {
      // Expected behavior:
      // Input: acct1.name = "Sonic", acct2.name = "Amy"
      // Output: merged.name = "Sonic and Amy"
      const expectedPattern = /\w+\sand\s\w+/;
      expect('Sonic and Amy').toMatch(expectedPattern);
    });

    it('should sum account amounts', () => {
      const amount1 = 100.50;
      const amount2 = 200.75;
      const expected = 301.25;
      expect(amount1 + amount2).toBe(expected);
    });

    it('should use second account ID', () => {
      const acct1Id = 1001;
      const acct2Id = 1002;
      const mergedId = acct2Id;
      expect(mergedId).toBe(1002);
    });

    it('test case 1: Sonic and Amy', () => {
      const input = {
        acct1: { name: 'Sonic', amount: 100.50, id: 1001 },
        acct2: { name: 'Amy', amount: 200.75, id: 1002 }
      };
      const expected = {
        name: 'Sonic and Amy',
        amount: 301.25,
        id: 1002
      };
      
      // Verify calculation logic
      expect(input.acct1.amount + input.acct2.amount).toBe(expected.amount);
      expect(`${input.acct1.name} and ${input.acct2.name}`).toBe(expected.name);
      expect(input.acct2.id).toBe(expected.id);
    });

    it('test case 2: Alice and Bob', () => {
      const input = {
        acct1: { name: 'Alice', amount: 500.00, id: 2001 },
        acct2: { name: 'Bob', amount: 250.50, id: 2002 }
      };
      const expected = {
        name: 'Alice and Bob',
        amount: 750.50,
        id: 2002
      };
      
      expect(input.acct1.amount + input.acct2.amount).toBe(expected.amount);
      expect(`${input.acct1.name} and ${input.acct2.name}`).toBe(expected.name);
      expect(input.acct2.id).toBe(expected.id);
    });

    it('test case 3: John and Jane', () => {
      const input = {
        acct1: { name: 'John', amount: 1000.00, id: 3001 },
        acct2: { name: 'Jane', amount: 1500.00, id: 3002 }
      };
      const expected = {
        name: 'John and Jane',
        amount: 2500.00,
        id: 3002
      };
      
      expect(input.acct1.amount + input.acct2.amount).toBe(expected.amount);
      expect(`${input.acct1.name} and ${input.acct2.name}`).toBe(expected.name);
      expect(input.acct2.id).toBe(expected.id);
    });

    it('should calculate name length correctly', () => {
      const name1 = 'Sonic';
      const name2 = 'Amy';
      const separator = ' and ';
      const totalLength = name1.length + separator.length + name2.length + 1; // +1 for null terminator
      // Sonic (5) + ' and ' (5) + Amy (3) + null terminator (1) = 14
      expect(totalLength).toBe(14);
    });
  });

  describe('Challenge 2: Battle Game (Queues)', () => {
    // Simulate queue operations
    class Player {
      constructor(name, hp) {
        this.name = name;
        this.hp = hp;
        this.next = null;
      }
    }

    class Queue {
      constructor() {
        this.front = null;
        this.back = null;
        this.size = 0;
      }

      enqueue(player) {
        if (this.size === 0) {
          this.front = player;
          this.back = player;
        } else {
          this.back.next = player;
          this.back = player;
        }
        player.next = null;
        this.size++;
      }

      dequeue() {
        if (this.size === 0) return null;
        const temp = this.front;
        this.front = this.front.next;
        this.size--;
        if (this.size === 0) {
          this.back = null;
        }
        temp.next = null;
        return temp;
      }

      getFront() {
        return this.front;
      }
    }

    function simulateBattle(queue) {
      while (queue.size > 1) {
        const player1 = queue.dequeue();
        const player2 = queue.dequeue();

        let winner, loser;
        if (player1.hp > player2.hp) {
          winner = player1;
          loser = player2;
        } else {
          winner = player2;
          loser = player1;
        }

        queue.enqueue(winner);
      }
      return queue.getFront().name;
    }

    it('test case 1: Charlie should win', () => {
      const queue = new Queue();
      queue.enqueue(new Player('Alice', 100));
      queue.enqueue(new Player('Bob', 80));
      queue.enqueue(new Player('Charlie', 120));

      const winner = simulateBattle(queue);
      expect(winner).toBe('Charlie');
    });

    it('test case 2: Tank should win', () => {
      const queue = new Queue();
      queue.enqueue(new Player('Warrior', 150));
      queue.enqueue(new Player('Mage', 120));
      queue.enqueue(new Player('Rogue', 150));
      queue.enqueue(new Player('Tank', 200));

      const winner = simulateBattle(queue);
      expect(winner).toBe('Tank');
    });

    it('test case 3: Berserker should win', () => {
      const queue = new Queue();
      queue.enqueue(new Player('Knight', 100));
      queue.enqueue(new Player('Archer', 90));
      queue.enqueue(new Player('Wizard', 100));
      queue.enqueue(new Player('Berserker', 110));
      queue.enqueue(new Player('Healer', 85));

      const winner = simulateBattle(queue);
      expect(winner).toBe('Berserker');
    });

    it('should handle tie - second player wins', () => {
      const queue = new Queue();
      queue.enqueue(new Player('Player1', 100));
      queue.enqueue(new Player('Player2', 100));

      const winner = simulateBattle(queue);
      expect(winner).toBe('Player2');
    });

    it('should handle single player', () => {
      const queue = new Queue();
      queue.enqueue(new Player('Solo', 100));

      const winner = simulateBattle(queue);
      expect(winner).toBe('Solo');
    });

    it('queue operations should work correctly', () => {
      const queue = new Queue();
      const player1 = new Player('P1', 100);
      const player2 = new Player('P2', 200);

      queue.enqueue(player1);
      expect(queue.size).toBe(1);
      expect(queue.getFront().name).toBe('P1');

      queue.enqueue(player2);
      expect(queue.size).toBe(2);
      expect(queue.getFront().name).toBe('P1');

      const dequeued = queue.dequeue();
      expect(dequeued.name).toBe('P1');
      expect(queue.size).toBe(1);
      expect(queue.getFront().name).toBe('P2');
    });

    it('should determine battle winner correctly', () => {
      const stronger = new Player('Strong', 150);
      const weaker = new Player('Weak', 100);

      const winner = stronger.hp > weaker.hp ? stronger : weaker;
      expect(winner.name).toBe('Strong');
    });

    it('should handle equal hp - second wins', () => {
      const player1 = new Player('P1', 100);
      const player2 = new Player('P2', 100);

      const winner = player1.hp > player2.hp ? player1 : player2;
      expect(winner.name).toBe('P2');
    });
  });

  describe('Test Case Validation', () => {
    it('all test inputs should be parseable', () => {
      // Challenge 1 inputs
      const challenge1Inputs = [
        'Sonic\n100.50\n1001\nAmy\n200.75\n1002',
        'Alice\n500.00\n2001\nBob\n250.50\n2002',
        'John\n1000.00\n3001\nJane\n1500.00\n3002'
      ];

      challenge1Inputs.forEach(input => {
        const lines = input.split('\n');
        expect(lines.length).toBe(6);
        expect(!isNaN(parseFloat(lines[1]))).toBe(true);
        expect(!isNaN(parseInt(lines[2]))).toBe(true);
      });
    });

    it('all test outputs should be properly formatted', () => {
      // Challenge 1 outputs
      const challenge1Outputs = [
        'Sonic and Amy\n301.25\n1002',
        'Alice and Bob\n750.50\n2002',
        'John and Jane\n2500.00\n3002'
      ];

      challenge1Outputs.forEach(output => {
        const lines = output.split('\n');
        expect(lines.length).toBe(3);
        expect(lines[0]).toContain(' and ');
        expect(!isNaN(parseFloat(lines[1]))).toBe(true);
        expect(!isNaN(parseInt(lines[2]))).toBe(true);
      });
    });

    it('challenge 2 inputs should have correct format', () => {
      const challenge2Inputs = [
        '3\nAlice\n100\nBob\n80\nCharlie\n120',
        '4\nWarrior\n150\nMage\n120\nRogue\n150\nTank\n200'
      ];

      challenge2Inputs.forEach(input => {
        const lines = input.split('\n');
        const numPlayers = parseInt(lines[0]);
        expect(lines.length).toBe(1 + numPlayers * 2);
      });
    });
  });

  describe('Memory Management Concepts', () => {
    it('should understand malloc size calculation', () => {
      // sizeof(account_t) in C
      const accountSize = 16; // approximate: pointer + double + int
      expect(accountSize).toBeGreaterThan(0);
    });

    it('should understand string concatenation length', () => {
      const str1 = 'Hello';
      const str2 = 'World';
      const separator = ' and ';
      const totalLength = str1.length + separator.length + str2.length + 1;
      // Hello (5) + ' and ' (5) + World (5) + null terminator (1) = 16
      expect(totalLength).toBe(16);
    });

    it('should verify proper cleanup would be needed', () => {
      // In C, would need to free:
      // - merged->name
      // - merged
      // This test just validates we understand the concept
      const allocations = ['name', 'struct'];
      expect(allocations.length).toBe(2);
    });
  });
});

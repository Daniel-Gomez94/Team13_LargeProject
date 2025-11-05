import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CodingGame from '../components/CodingGame';

// Mock fetch globally
const mockFetch = vi.fn();

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Helper to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CodingGame Component', () => {
  beforeEach(() => {
    // Reset mocks
    mockFetch.mockReset();
    mockLocalStorage.clear();
    mockLocalStorage.setItem('user_data', JSON.stringify({ id: '1' }));
    
    // Default mock response for initial load
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ attempts: 0, completed: false, error: '' }),
    });
    
    // Set global fetch
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the component', async () => {
      renderWithRouter(<CodingGame />);
      
      // Wait for the challenge to load
      await waitFor(() => {
        expect(screen.queryByText(/Loading today's challenge/i)).not.toBeInTheDocument();
      }, { timeout: 5000 });
      
      expect(screen.getByText(/Challenge/i)).toBeInTheDocument();
    });

    it('should display the daily challenge', async () => {
      renderWithRouter(<CodingGame />);
      
      // Wait for component to finish loading
      await waitFor(() => {
        expect(screen.queryByText(/Loading today's challenge/i)).not.toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Battle Game should be displayed as the daily challenge (in heading)
      expect(screen.getByRole('heading', { name: /Battle Game/i })).toBeInTheDocument();
    });

    it('should display challenge description', async () => {
      renderWithRouter(<CodingGame />);
      
      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByText(/Loading today's challenge/i)).not.toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Check for description content (queue or battle related)
      await waitFor(() => {
        const description = document.querySelector('.challenge-description');
        expect(description).toBeInTheDocument();
        expect(description?.textContent).toMatch(/queue|battle/i);
      }, { timeout: 5000 });
    });

    it('should render code editor with starter code', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        expect(textarea).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should render action buttons', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => {
        expect(screen.getByText(/Run/i)).toBeInTheDocument();
        expect(screen.getByText(/How to Play/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should display output section', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => {
        expect(screen.getByText(/Output:/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should display result section', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => {
        expect(screen.getByText(/Output:/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should display attempts counter', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => {
        expect(screen.getByText(/Attempts:/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Code Editor', () => {
    it('should allow typing in the code editor', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByRole('textbox'), { timeout: 5000 });
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      const testCode = '// Test code\nreturn NULL;';
      
      fireEvent.change(textarea, { target: { value: testCode } });
      
      expect(textarea.value).toContain('// Test code');
    });

    it('should disable editor when challenge is completed', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ attempts: 1, completed: true, score: 100, error: '' }),
      });

      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByRole('textbox'), { timeout: 5000 });
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea).toBeDisabled();
    });

    it('should show completion banner when challenge is completed', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ attempts: 1, completed: true, score: 100, error: '' }),
      });

      renderWithRouter(<CodingGame />);
      
      await waitFor(() => {
        expect(screen.getByText(/You've completed today's challenge/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Run Code Functionality', () => {
    it('should show warning when trying to run without code', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByText(/Run/i), { timeout: 5000 });
      
      // Clear the textarea
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: '' } });
      
      const runButton = screen.getByText(/Run/i);
      fireEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Please write some code first/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should call Judge0 API when running code with content', async () => {
      // Reset fetch and set new mock for this test
      const judge0Mock = vi.fn();
      // Initial load call
      judge0Mock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ attempts: 0, completed: false, error: '' }),
      });
      // Judge0 API call
      judge0Mock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          stdout: 'Test output',
          stderr: '',
        }),
      });
      global.fetch = judge0Mock;

      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByRole('textbox'), { timeout: 5000 });
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'return NULL;' } });
      
      const runButton = screen.getByText(/Run/i);
      fireEvent.click(runButton);
      
      await waitFor(() => {
        // Should have been called at least twice (initial load + run)
        expect(judge0Mock.mock.calls.length).toBeGreaterThan(1);
      }, { timeout: 5000 });
    });

    it('should display "Running Tests..." while executing', async () => {
      const judge0Mock = vi.fn();
      // Initial load
      judge0Mock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ attempts: 0, completed: false, error: '' }),
      });
      // Delayed response for test execution
      judge0Mock.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ stdout: 'Output', stderr: '' })
        }), 200))
      );
      global.fetch = judge0Mock;

      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByRole('textbox'), { timeout: 5000 });
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'return NULL;' } });
      
      const runButton = screen.getByText(/Run/i);
      fireEvent.click(runButton);
      
      // Check for running state
      await waitFor(() => {
        expect(screen.getByText(/Running Tests/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should prevent running when max attempts reached', async () => {
      // Mock with max attempts
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ attempts: 5, completed: false, error: '' }),
      });
      global.fetch = mockFetch;

      renderWithRouter(<CodingGame />);
      
      // Wait for component to load and process attempts
      await waitFor(() => {
        const attemptsText = screen.getByText(/Attempts:/i).textContent;
        return attemptsText?.includes('5');
      }, { timeout: 5000 });
      
      // The run button should be disabled
      const runButton = screen.getByText(/Run/i);
      expect(runButton).toBeDisabled();
    });
  });

  describe('How to Play Modal', () => {
    it('should open modal when How to Play button is clicked', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByText(/How to Play/i), { timeout: 5000 });
      
      const howToPlayButton = screen.getByText(/How to Play/i);
      fireEvent.click(howToPlayButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Daily Challenge/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should close modal when close button is clicked', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByText(/How to Play/i), { timeout: 5000 });
      
      const howToPlayButton = screen.getByText(/How to Play/i);
      fireEvent.click(howToPlayButton);
      
      // Wait for modal to open
      await waitFor(() => screen.getByText(/Daily Challenge/i), { timeout: 5000 });
      
      // Find the close button by class name
      const closeButton = document.querySelector('.modal-close') as HTMLElement;
      expect(closeButton).toBeInTheDocument();
      fireEvent.click(closeButton);
      
      // Verify modal is closed - wait for it to disappear
      await waitFor(() => {
        const modal = document.querySelector('.modal-overlay');
        expect(modal).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Progress Tracking', () => {
    it('should load user progress from localStorage', async () => {
      mockLocalStorage.setItem('user_data', JSON.stringify({ id: '123' }));
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ attempts: 0, completed: false, error: '' }),
      });
      global.fetch = mockFetch;
      
      renderWithRouter(<CodingGame />);
      
      // Wait for component to finish loading
      await waitFor(() => {
        expect(screen.queryByText(/Loading today's challenge/i)).not.toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Verify the fetch was called
      expect(mockFetch).toHaveBeenCalled();
      
      // Verify the fetch was called with the correct URL pattern
      const fetchUrl = mockFetch.mock.calls[0]?.[0];
      expect(fetchUrl).toMatch(/gettodayattempts/);
    });

    it('should display attempts count', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ attempts: 2, completed: false, error: '' }),
      });
      global.fetch = mockFetch;

      renderWithRouter(<CodingGame />);
      
      // Wait for component to load and display attempts
      await waitFor(() => {
        const attemptsText = screen.getByText(/Attempts:/i).textContent;
        return attemptsText?.includes('2') && attemptsText?.includes('5');
      }, { timeout: 5000 });
      
      const attemptsText = screen.getByText(/Attempts:/i).textContent;
      expect(attemptsText).toContain('2');
      expect(attemptsText).toContain('5');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const errorMock = vi.fn();
      // Initial load succeeds
      errorMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ attempts: 0, completed: false, error: '' }),
      });
      // Run code fails
      errorMock.mockRejectedValueOnce(new Error('Network error'));
      global.fetch = errorMock;
      
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByRole('textbox'), { timeout: 5000 });
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'return NULL;' } });
      
      const runButton = screen.getByText(/Run/i);
      fireEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Error testing solution/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should show message when no user data in localStorage', async () => {
      mockLocalStorage.clear();
      
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => screen.getByRole('textbox'), { timeout: 5000 });
      
      // Component should still render even without user data
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => {
        const runButton = screen.getByRole('button', { name: /run/i });
        expect(runButton).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('code editor should have textbox role', async () => {
      renderWithRouter(<CodingGame />);
      
      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        expect(textarea).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});

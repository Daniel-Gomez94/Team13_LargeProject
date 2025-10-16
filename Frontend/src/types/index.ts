export interface Question {
  _id?: string;
  id: number;
  title: string;
  description: string;
  starterCode: string;
  fullCode: string;
  expectedOutput: string;
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  completedQuestions: number[];
  progress: Record<string, UserProgress>;
}

export interface UserProgress {
  code: string;
  completed: boolean;
  lastModified: Date;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CodeExecutionResult {
  output: string;
  stderr?: string;
  time?: string;
  memory?: string;
  status?: any;
  isCorrect: boolean;
  compilation_error?: string;
}
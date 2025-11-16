export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  //verifyEmail: (code: number) => Promise<void>;
  loading: boolean;
}

export interface User {
  _id?: string;
  handle: string;
  email: string;
  score: number;
  verified: Boolean;
  createdAt: Date;
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

export interface Question {
  _id?: string;
  id: number;
  title: string;
  description: string;
  starterCode: string;
  fullCode: string;
  expectedOutput: string;
}
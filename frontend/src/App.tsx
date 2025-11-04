import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import GamePage from './pages/CardPage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/cards" element={<GamePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
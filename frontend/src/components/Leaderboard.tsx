import { useState, useEffect } from 'react';

interface ScoreEntry {
    userId: string;
    firstName: string;
    lastName: string;
    totalScore: number;
    totalCompletions: number;
}

interface StreakEntry {
    userId: string;
    firstName: string;
    lastName: string;
    longestStreak: number;
    currentStreak: number;
}

function Leaderboard() {
    const [activeTab, setActiveTab] = useState<'score' | 'streak'>('score');
    const [scoreLeaderboard, setScoreLeaderboard] = useState<ScoreEntry[]>([]);
    const [streakLeaderboard, setStreakLeaderboard] = useState<StreakEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const app_name = '159.65.36.255';
    
    function buildPath(route: string): string {
        if (import.meta.env.MODE != 'development') {
            return 'http://' + app_name + ':5000/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    const loadScoreLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(buildPath('api/leaderboard/score'));
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setScoreLeaderboard(data.leaderboard);
            }
        } catch (err: any) {
            setError('Failed to load score leaderboard: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadStreakLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(buildPath('api/leaderboard/streak'));
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setStreakLeaderboard(data.leaderboard);
            }
        } catch (err: any) {
            setError('Failed to load streak leaderboard: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'score') {
            loadScoreLeaderboard();
        } else {
            loadStreakLeaderboard();
        }
    }, [activeTab]);

    const getMedalEmoji = (rank: number): string => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `${rank}.`;
    };

    return (
        <div id="leaderboardDiv">
            <h1>🏆 Leaderboard</h1>
            
            <div className="leaderboard-tabs">
                <button 
                    className={`tab-button ${activeTab === 'score' ? 'active' : ''}`}
                    onClick={() => setActiveTab('score')}
                >
                    📊 Top Scores
                </button>
                <button 
                    className={`tab-button ${activeTab === 'streak' ? 'active' : ''}`}
                    onClick={() => setActiveTab('streak')}
                >
                    🔥 Longest Streaks
                </button>
            </div>

            {loading && (
                <div className="loading">Loading leaderboard...</div>
            )}

            {error && (
                <div className="error-message">{error}</div>
            )}

            {!loading && !error && activeTab === 'score' && (
                <div className="leaderboard-content">
                    <h2>Top Performers by Score</h2>
                    <p className="leaderboard-description">
                        Earn more points by solving challenges with fewer attempts!
                    </p>
                    {scoreLeaderboard.length === 0 ? (
                        <div className="empty-state">No scores yet. Be the first to complete a challenge!</div>
                    ) : (
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th className="align-left">Player</th>
                                    <th>Total Score</th>
                                    <th>Completions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scoreLeaderboard.map((entry, index) => (
                                    <tr key={entry.userId} className={index < 3 ? 'top-three' : ''}>
                                        <td className="rank-cell">{getMedalEmoji(index + 1)}</td>
                                        <td className="name-cell">
                                            {entry.firstName} {entry.lastName}
                                        </td>
                                        <td className="score-cell">{entry.totalScore}</td>
                                        <td className="completions-cell">{entry.totalCompletions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {!loading && !error && activeTab === 'streak' && (
                <div className="leaderboard-content">
                    <h2>Longest Streaks</h2>
                    <p className="leaderboard-description">
                        Complete challenges on consecutive days to build your streak!
                    </p>
                    {streakLeaderboard.length === 0 ? (
                        <div className="empty-state">No streaks yet. Start completing challenges daily!</div>
                    ) : (
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th className="align-left">Player</th>
                                    <th>Longest Streak</th>
                                    <th>Current Streak</th>
                                </tr>
                            </thead>
                            <tbody>
                                {streakLeaderboard.map((entry, index) => (
                                    <tr key={entry.userId} className={index < 3 ? 'top-three' : ''}>
                                        <td className="rank-cell">{getMedalEmoji(index + 1)}</td>
                                        <td className="name-cell">
                                            {entry.firstName} {entry.lastName}
                                        </td>
                                        <td className="streak-cell">
                                            🔥 {entry.longestStreak} days
                                        </td>
                                        <td className="current-streak-cell">
                                            {entry.currentStreak > 0 ? `⚡ ${entry.currentStreak} days` : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;

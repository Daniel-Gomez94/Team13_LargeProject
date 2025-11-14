import { useState, useEffect } from 'react';
import type { Challenge } from '../data/challenges';
import { challenges, hiddenMains } from '../data/challenges';

function CodingGame() {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [hasCompletedToday, setHasCompletedToday] = useState(false);
    const [attemptsUsed, setAttemptsUsed] = useState(0);
    const [score, setScore] = useState(0);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const MAX_ATTEMPTS = 5;

    const app_name = 'codele.xyz';
    
    function buildPath(route: string): string {
        if (import.meta.env.MODE != 'development') {
            return 'https://' + app_name + ':5000/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    // Calculate score based on attempts (more points for fewer attempts)
    const calculateScore = (attempts: number): number => {
        const baseScore = 100;
        const penalties = [0, 10, 20, 30, 40]; // Penalties for each attempt
        const penalty = penalties[attempts - 1] || 50;
        return Math.max(baseScore - penalty, 10); // Minimum 10 points
    };

    const loadDailyChallenge = async () => {
        // Get today's date
        const today = new Date().toDateString();
        
        // Use date to pick a challenge (cycles through challenges)
        // For now, set to challenge 2 (Battle Game - Queues)
        const dailyChallenge = challenges[1]; // Index 1 = Challenge ID 2
        
        setChallenge(dailyChallenge);
        // Initialize with just the editable portion (empty function body)
        setCode('    // Your code here\n');

        // Check attempts from backend
        const userData = localStorage.getItem('user_data');
        if (userData) {
            const user = JSON.parse(userData);
            try {
                const response = await fetch(buildPath(`api/gettodayattempts/${user.id}/${today}`));
                const data = await response.json();
                
                console.log('Loading attempts data:', data);
                
                setAttemptsUsed(data.attempts || 0);
                setHasCompletedToday(data.completed || false);
                
                // If completed, calculate and display the score
                if (data.completed && data.attempts > 0) {
                    const earnedScore = calculateScore(data.attempts);
                    setScore(earnedScore);
                }
            } catch (error) {
                console.error('Error loading attempts:', error);
            }
        }
        
        // Auto-resize textarea after initial load
        setTimeout(() => {
            const textarea = document.querySelector('.code-editable') as HTMLTextAreaElement;
            if (textarea) {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            }
        }, 100);
    };

    useEffect(() => {
        loadDailyChallenge();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const runCode = async () => {
        if (!code.trim()) {
            setOutput('Please write some code first!');
            return;
        }

        // Check if max attempts reached
        if (attemptsUsed >= MAX_ATTEMPTS) {
            setOutput('❌ Maximum attempts reached (5/5). Try again tomorrow!');
            return;
        }

        if (hasCompletedToday) {
            setOutput('✅ You already completed today\'s challenge!');
            return;
        }

        setIsRunning(true);
        setTestResults([]);
        setOutput('Testing your solution...');

        const today = new Date().toDateString();
        const currentAttempt = attemptsUsed + 1;

        try {
            const results = [];

            // Reconstruct the full code
            const starterLines = challenge!.starterCode.split('\n');
            const editableStart = challenge!.editableRegion?.start || 11;
            const codeTop = starterLines.slice(0, editableStart).join('\n');
            const codeBottom = '}';
            const fullUserCode = codeTop + '\n' + code + '\n' + codeBottom;

            // Append the hidden main function to user's code
            const fullCode = fullUserCode + '\n' + (hiddenMains[challenge!.id] || '');
            
            // Run all test cases
            for (let i = 0; i < challenge!.testCases.length; i++) {
                const testCase = challenge!.testCases[i];
                
                const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': '7f086cd239msh46b973a3ab8a5d8p12c5d8jsn6cb22918b98c',
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    },
                    body: JSON.stringify({
                        source_code: fullCode,
                        language_id: 50, // C (GCC 9.2.0)
                        stdin: testCase.input
                    })
                });

                const result = await response.json();
                const passed = result.stdout?.trim() === testCase.expected.trim();
                
                results.push({
                    testNum: i + 1,
                    passed,
                    expected: testCase.expected,
                    actual: result.stdout?.trim() || '',
                    error: result.stderr || result.compile_output
                });
            }

            setTestResults(results);
            
            const allPassed = results.every(r => r.passed);
            
            // Record the attempt
            let _ud: any = localStorage.getItem('user_data');
            if (_ud && challenge) {
                let ud = JSON.parse(_ud);
                
                await fetch(buildPath('api/recordattempt'), {
                    method: 'POST',
                    body: JSON.stringify({ 
                        userId: ud.id, 
                        challengeId: challenge.id, 
                        date: today,
                        attemptNumber: currentAttempt,
                        passed: allPassed
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                setAttemptsUsed(currentAttempt);

                if (allPassed) {
                    const earnedScore = calculateScore(currentAttempt);
                    setScore(earnedScore);
                    setOutput(`\uD83C\uDF89 Congratulations! All test cases passed!\n\u2728 Score: ${earnedScore} points (Attempt ${currentAttempt}/${MAX_ATTEMPTS})`);
                    setHasCompletedToday(true);
                    
                    // Save completion to backend
                    await fetch(buildPath('api/completechallenge'), {
                        method: 'POST',
                        body: JSON.stringify({ 
                            userId: ud.id, 
                            challengeId: challenge.id, 
                            date: today,
                            attempts: currentAttempt,
                            score: earnedScore
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    });
                } else {
                    const failedCount = results.filter(r => !r.passed).length;
                    const attemptsLeft = MAX_ATTEMPTS - currentAttempt;
                    setOutput(`❌ ${failedCount} test case(s) failed. ${attemptsLeft} attempt(s) remaining.`);
                }
            }
        } catch (error: any) {
            setOutput('Error testing solution: ' + error.message);
        } finally {
            setIsRunning(false);
        }
    };

    if (!challenge) {
        return <div>Loading today's challenge...</div>;
    }

    const attemptsLeft = MAX_ATTEMPTS - attemptsUsed;

    return (
        <div id="codingGameDiv">
            {showHowToPlay && (
                <div className="modal-overlay" onClick={() => setShowHowToPlay(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🎮 How to Play</h2>
                            <button className="modal-close" onClick={() => setShowHowToPlay(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="how-to-play-content">
                                <h3>📅 Daily Challenge</h3>
                                <p>A new coding challenge is available every day! Complete it to earn points and maintain your streak.</p>
                                
                                <h3>💯 Scoring System</h3>
                                <ul>
                                    <li><strong>1st attempt:</strong> 100 points</li>
                                    <li><strong>2nd attempt:</strong> 90 points</li>
                                    <li><strong>3rd attempt:</strong> 80 points</li>
                                    <li><strong>4th attempt:</strong> 70 points</li>
                                    <li><strong>5th attempt:</strong> 60 points</li>
                                </ul>
                                <p>Fewer attempts = Higher score!</p>
                                
                                <h3>🎯 How to Submit</h3>
                                <ol>
                                    <li>Read the challenge description carefully</li>
                                    <li>Write your code in the editable section</li>
                                    <li>Click "Run" to test your solution</li>
                                    <li>If all test cases pass, you've completed the challenge!</li>
                                    <li>You have a maximum of 5 attempts per day</li>
                                </ol>
                                
                                <h3>🏆 Compete & Win</h3>
                                <p>Check the <strong>Leaderboard</strong> to see how you rank against other knights!</p>
                                <ul>
                                    <li><strong>Score Board:</strong> Top performers by total points</li>
                                    <li><strong>Streak Board:</strong> Longest consecutive daily completions</li>
                                </ul>
                                
                                <h3>⚔️ Good Luck, Knight!</h3>
                                <p>Write efficient code, solve challenges, and climb the leaderboard!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {hasCompletedToday && (
                <div className="completion-banner">
                    ✅ You've completed today's challenge! Score: {score} points. Come back tomorrow for a new one.
                </div>
            )}
            
            <div className="challenge-header">
                <h2>{challenge.title}</h2>
                <div className="challenge-meta">
                    <span className="difficulty">
                        Challenge Type: {challenge.type}
                    </span>
                    <span className="attempts-counter">
                        Attempts: {attemptsUsed}/{MAX_ATTEMPTS}
                    </span>
                    <button 
                        className="how-to-play-button"
                        onClick={() => setShowHowToPlay(true)}
                        title="How to Play"
                    >
                        <span className="button-icon">❓</span>
                        How to Play
                    </button>
                </div>
            </div>

            <div className="challenge-description">
                <p style={{ whiteSpace: 'pre-line' }}>{challenge.description}</p>
            </div>

            <div className="code-editor">
                <div className="code-editor-wrapper">
                    <div className="code-readonly-top">
                        {challenge.starterCode.split('\n').slice(0, challenge.editableRegion?.start || 11).join('\n')}
                    </div>
                    <textarea
                        className="code-editable"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            // Auto-resize textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        placeholder="    // Your code here\n    return NULL;"
                        spellCheck={false}
                        disabled={hasCompletedToday || attemptsUsed >= MAX_ATTEMPTS}
                        style={{ minHeight: '60px', overflow: 'hidden' }}
                    />
                    <div className="code-readonly-bottom">
                        {'}'}
                    </div>
                </div>
            </div>

            {challenge.testCases.length > 0 && (
                <div className="expected-output-hint">
                    <strong>Expected Output Example:</strong> <code>{challenge.testCases[0].expected}</code>
                </div>
            )}

            <div className="button-group">
                <button 
                    className="buttons run-button" 
                    onClick={runCode} 
                    disabled={isRunning || hasCompletedToday || attemptsUsed >= MAX_ATTEMPTS}
                >
                    {isRunning ? '\u231B Running Tests...' : `\u25B6\uFE0F Run (${attemptsLeft} left)`}
                </button>
            </div>

            <div className="output-section">
                <h3>Output:</h3>
                <pre className="output-display">{output}</pre>
            </div>

            {testResults.length > 0 && (
                <div className="test-results">
                    <h3>Test Results:</h3>
                    {testResults.map((result, idx) => (
                        <div key={idx} className={`test-case ${result.passed ? 'passed' : 'failed'}`}>
                            <div className="test-header">
                                Test Case {result.testNum}: {result.passed ? '\u2705 Passed' : '\u274C Failed'}
                            </div>
                            {!result.passed && (
                                <div className="test-details">
                                    <div>Expected: {result.expected}</div>
                                    <div>Got: {result.actual || 'No output'}</div>
                                    {result.error && <div className="error">Error: {result.error}</div>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CodingGame;
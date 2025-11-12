import { useState, useEffect } from 'react';

function LoggedInName() {
    const [userName, setUserName] = useState('User');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editMessage, setEditMessage] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            const user = JSON.parse(userData);
            setUserName(`${user.firstName} ${user.lastName}`);
        }

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-dropdown-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    function doLogout(event: any): void {
        event.preventDefault();
        localStorage.removeItem("user_data");
        window.location.href = '/';
    };

    function goToLeaderboard(): void {
        window.location.href = '/leaderboard';
        setShowDropdown(false);
    };

    function goToGame(): void {
        window.location.href = '/game';
        setShowDropdown(false);
    };

    function openEditModal(): void {
        setShowDropdown(false);
        setShowEditModal(true);
        setEditMessage('');
        setEditEmail('');
        setEditPassword('');
        setConfirmPassword('');
    };

    function closeEditModal(): void {
        setShowEditModal(false);
        setEditMessage('');
        setEditEmail('');
        setEditPassword('');
        setConfirmPassword('');
    };

    const app_name = '159.65.36.255';
    
    function buildPath(route: string): string {
        if (import.meta.env.MODE != 'development') {
            return 'https://' + app_name + ':5000/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    async function handleUpdateAccount(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setEditMessage('');

        const userData = localStorage.getItem('user_data');
        if (!userData) {
            setEditMessage('User not found');
            return;
        }

        const user = JSON.parse(userData);

        // Validation
        if (!editEmail && !editPassword) {
            setEditMessage('Please enter at least one field to update');
            return;
        }

        if (editPassword && editPassword !== confirmPassword) {
            setEditMessage('Passwords do not match');
            return;
        }

        if (editEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(editEmail)) {
                setEditMessage('Please enter a valid email address');
                return;
            }
        }

        try {
            const updateData: any = { userId: user.id };
            if (editEmail) updateData.email = editEmail.trim();
            if (editPassword) updateData.password = editPassword.trim();

            const response = await fetch(buildPath('api/updateaccount'), {
                method: 'POST',
                body: JSON.stringify(updateData),
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await response.json();

            if (result.error) {
                setEditMessage(result.error);
            } else {
                setEditMessage('✅ Account updated successfully!');
                setTimeout(() => {
                    closeEditModal();
                }, 2000);
            }
        } catch (error: any) {
            setEditMessage('Error updating account: ' + error.toString());
        }
    }

    const isLeaderboardPage = window.location.pathname === '/leaderboard';

    return (
        <>
            <div id="loggedInDiv">
                <div className="header-left">
                    <h1 className="header-logo">Codele</h1>
                </div>
                <div className="header-right">
                    <button 
                        className="theme-toggle-header" 
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    {isLeaderboardPage ? (
                        <button type="button" className="buttons nav-button"
                            onClick={goToGame}>🎮 Game</button>
                    ) : (
                        <button type="button" className="buttons nav-button"
                            onClick={goToLeaderboard}>🏆 Leaderboard</button>
                    )}
                    <div className="user-dropdown-container">
                        <button 
                            className="user-dropdown-button"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <span className="user-icon">👤</span>
                            <span className="user-name">{userName}</span>
                            <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
                        </button>
                        {showDropdown && (
                            <div className="user-dropdown-menu">
                                <button className="dropdown-item" onClick={openEditModal}>
                                    <span className="dropdown-icon">⚙️</span>
                                    Edit Account
                                </button>
                                <button className="dropdown-item logout-item" onClick={doLogout}>
                                    <span className="dropdown-icon">🚪</span>
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Account Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Account Information</h2>
                            <button className="modal-close" onClick={closeEditModal}>×</button>
                        </div>
                        <form onSubmit={handleUpdateAccount}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="editEmail">New Email (optional)</label>
                                    <input
                                        type="email"
                                        id="editEmail"
                                        placeholder="Enter new email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editPassword">New Password (optional)</label>
                                    <input
                                        type="password"
                                        id="editPassword"
                                        placeholder="Enter new password"
                                        value={editPassword}
                                        onChange={(e) => setEditPassword(e.target.value)}
                                    />
                                </div>
                                {editPassword && (
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                )}
                                {editMessage && (
                                    <div className={`modal-message ${editMessage.includes('✅') ? 'success' : 'error'}`}>
                                        {editMessage}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="buttons modal-button-cancel" onClick={closeEditModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="buttons modal-button-save">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
export default LoggedInName;
import { useState, useEffect } from 'react';

function PageTitle() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        // Check for saved theme preference or default to dark mode
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="header-container">
            <h1 id="title" className="main-title">Codele</h1>
            <button 
                className="theme-toggle" 
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDarkMode ? '??' : '??'}
            </button>
        </div>
    );
};

export default PageTitle;
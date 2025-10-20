# Standalone Practice Component

This project now includes a standalone React component that replicates the functionality of the original HTML file (`index.html`) while being integrated into the React application.

## Features

The standalone practice component (`/standalone` route) includes:

- **All original questions**: Exact same 4 coding questions as the original HTML
- **Local storage progress**: Saves progress to browser localStorage
- **Code execution**: Uses Judge0 API for C code compilation and execution
- **Progress tracking**: Visual progress bar and completion status
- **Question navigation**: Easy navigation between questions
- **Tab support**: Tab key works in the code editor
- **Reset functionality**: Reset code to starter template
- **UCF Theming**: Maintains the original UCF Knights theme

## How to Access

1. **Standalone Mode**: Navigate to `http://localhost:3000/standalone`
   - Works independently without authentication
   - Uses local storage for progress tracking
   - Direct client-side code execution via Judge0 API

2. **Authenticated Mode**: Navigate to `http://localhost:3000/`
   - Requires login/registration
   - Uses backend API for progress tracking
   - Integrated with user account system

## Key Differences from Original HTML

- **React Integration**: Component-based architecture
- **TypeScript Support**: Type-safe development
- **Routing**: Integrated with React Router
- **Navigation**: Links to switch between modes
- **Modern Styling**: CSS modules for better organization

## Original Files

The original HTML functionality is preserved in:
- `index.html` - Original standalone HTML file
- `script.js` - Original JavaScript functionality
- `styles.css` - Original CSS styling

## React Implementation

The React version includes:
- `StandalonePractice.tsx` - Main component
- `StandalonePractice.css` - Component-specific styles
- Route integration in `App.tsx`
- Header navigation updates

## API Configuration

The component uses the Judge0 API for code execution. Make sure to:
1. Replace the RapidAPI key in `StandalonePractice.tsx` with your own key
2. The key is currently set to a placeholder value

## Usage

1. Start the development server: `npm start`
2. Navigate to `http://localhost:3000/standalone`
3. Code your C functions and click "Run Code"
4. Progress is automatically saved to localStorage
5. Navigate between questions using the Q1-Q4 buttons
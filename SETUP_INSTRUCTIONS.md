# MERN Stack Conversion Setup Instructions

## ?? Quick Setup Guide

This project has been successfully converted from a static HTML/JavaScript application to a full MERN (MongoDB, Express, React, Node.js) stack application.

## ?? Project Structure

The project now consists of:

- **Backend/**: Node.js Express server with MongoDB
- **Frontend/**: React TypeScript application
- **Root**: Configuration files and scripts

## ?? Setup Steps

### 1. Install Dependencies

First, install the root dependencies:
```bash
npm install
```

Then install backend dependencies:
```bash
cd Backend
npm install
```

Finally, install frontend dependencies:
```bash
cd ../Frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the Backend directory:
```bash
cd Backend
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/ucf_coding_practice
JWT_SECRET=your_super_secure_jwt_secret_key_here
RAPIDAPI_KEY=your_rapidapi_key_for_judge0
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running, then seed the database:
```bash
cd Backend
node seedDatabase.js
```

### 4. Run the Application

From the root directory, start both servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

## ?? New Features

### Authentication System
- User registration and login
- JWT-based authentication
- Protected routes
- User progress persistence

### Enhanced Functionality
- All user progress is saved to MongoDB
- Multi-user support
- Real-time code execution
- Improved UI/UX with React components

### API Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/questions` - Get all questions
- `POST /api/progress/save` - Save user progress
- `POST /api/code/run` - Execute code

## ?? Migration from Original

The original functionality has been preserved and enhanced:

1. **Questions**: All 4 original questions are now stored in MongoDB
2. **Code Execution**: Still uses Judge0 API but now through backend
3. **Progress**: User progress is now persistent across sessions
4. **UI**: Maintains the UCF theme but with improved React components

## ?? Usage

1. **Register/Login**: Users must create an account or log in
2. **Practice**: Navigate through questions using the question navigation
3. **Code**: Write C code in the editor with syntax highlighting
4. **Execute**: Run code and get real-time feedback
5. **Progress**: Progress is automatically saved and restored

## ?? Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production

### Technologies Used

- **Frontend**: React 18, TypeScript, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Code Execution**: Judge0 API
- **Styling**: Custom CSS with UCF branding

## ?? UI/UX Improvements

- Responsive design for mobile devices
- Improved code editor with tab support
- Visual progress indicators
- Better error handling and user feedback
- UCF-themed color scheme maintained

## ?? Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration

## ?? Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  completedQuestions: [Number],
  progress: Map
}
```

### Questions Collection
```javascript
{
  id: Number,
  title: String,
  description: String,
  starterCode: String,
  fullCode: String,
  expectedOutput: String
}
```

This conversion maintains all the original functionality while adding modern web development practices and user management capabilities.
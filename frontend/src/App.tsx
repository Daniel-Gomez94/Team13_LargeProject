import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import CodingPractice from './components/CodingPractice';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import VerifyEmail from './components/VerifyEmail';
import RequestPassReset from './components/RequestPassReset';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/request-pass-reset" element={<RequestPassReset />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <CodingPractice />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
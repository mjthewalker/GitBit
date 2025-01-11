import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import Home from './components/Home';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = document.cookie.includes('token=');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route
              path="/login"
              element={
                <>
                  <div className="flex justify-center space-x-4 py-8">
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`px-6 py-2 rounded-full transition-all duration-300 ${
                        !isLogin
                          ? 'bg-emerald-700 text-white shadow-lg'
                          : 'bg-white/80 text-emerald-900 hover:bg-white'
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`px-6 py-2 rounded-full transition-all duration-300 ${
                        isLogin
                          ? 'bg-emerald-700 text-white shadow-lg'
                          : 'bg-white/80 text-emerald-900 hover:bg-white'
                      }`}
                    >
                      Login
                    </button>
                  </div>
                  {isLogin ? <LoginForm /> : <SignupForm />}
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
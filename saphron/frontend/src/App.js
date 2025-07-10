import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="w-full bg-white/80 backdrop-blur-sm shadow flex items-center px-6 py-3 mb-8">
          <div className="flex-1 text-2xl font-bold text-blue-700">
            <Link to="/">Saphron Quore</Link>
          </div>
          <div className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/quiz" className="text-gray-700 hover:text-blue-600 font-medium">Quiz</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

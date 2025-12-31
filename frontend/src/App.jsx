import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WeatherProvider } from './context/WeatherContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AISection from './pages/AISection';
import Settings from './pages/Settings';

import BackgroundLayout from './components/BackgroundLayout';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './context/AuthContext';
import { useWeather } from './context/WeatherContext';

const AppContent = () => {
  return (
    <BackgroundLayout>
      <div className="min-h-screen">
        <Navbar />
        <LoginModal />
        <main className="container-custom pt-28">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai" element={<AISection />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BackgroundLayout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WeatherProvider>
          <Router>
            <AppContent />
          </Router>
        </WeatherProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}


export default App;

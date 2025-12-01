import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Chatbot from './pages/Chatbot/Chatbot';
import ProviderPortal from './pages/ProviderPortal/ProviderPortal';
import Privacy from './pages/Privacy/Privacy';
import Integration from './pages/Integration/Integration';
import Diseases from './pages/Diseases/Diseases';
import Education from './pages/Education/Education';
import Gamification from './pages/Gamification/Gamification';
import Login from './components/Login';
import HealthDataPrompt from './components/HealthDataPrompt';
import ProtectedRoute from './components/ProtectedRoute';
import ConnectionTest from './components/ConnectionTest';
import './styles/main.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [needsHealthData, setNeedsHealthData] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log('Frontend-Backend connection successful:', data);
      })
      .catch(error => {
        console.error('Frontend-Backend connection failed:', error);
      });
  }, []);

  const shouldAskForHealthData = (lastEntryTime) => {
    if (!lastEntryTime) return true;

    const sevenHoursInMs = 7 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - new Date(lastEntryTime).getTime();

    return timeDifference >= sevenHoursInMs;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const lastHealthDataEntry = localStorage.getItem('lastHealthDataEntry');

    if (token && userType) {
      setIsLoggedIn(true);
      setUserType(userType);

      if (userType === 'patient') {
        if (shouldAskForHealthData(lastHealthDataEntry)) {
          setNeedsHealthData(true);
        } else {
          setNeedsHealthData(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || userType !== 'patient') return;

    const interval = setInterval(() => {
      const lastHealthDataEntry = localStorage.getItem('lastHealthDataEntry');
      if (shouldAskForHealthData(lastHealthDataEntry)) {
        setNeedsHealthData(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn, userType]);

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);

    if (type === 'patient') {
      const lastHealthDataEntry = localStorage.getItem('lastHealthDataEntry');

      if (shouldAskForHealthData(lastHealthDataEntry)) {
        setNeedsHealthData(true);
      } else {
        setNeedsHealthData(false);
      }
    }
  };

  const handleHealthDataSubmitted = (healthData) => {
    setNeedsHealthData(false);
    localStorage.setItem('lastHealthDataEntry', new Date().toISOString());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    localStorage.removeItem('lastHealthDataEntry');

    setIsLoggedIn(false);
    setUserType(null);
    setNeedsHealthData(false);
  };

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} userType={userType} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<>
              <LandingPage />
              <ConnectionTest />
            </>} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/health-data"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                  <HealthDataPrompt onHealthDataSubmitted={handleHealthDataSubmitted} isPeriodicCheck={false} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                needsHealthData ? (
                  <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                    <HealthDataPrompt onHealthDataSubmitted={handleHealthDataSubmitted} isPeriodicCheck={true} />
                  </ProtectedRoute>
                ) : (
                  <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                    <Dashboard />
                  </ProtectedRoute>
                )
              }
            />
            <Route
              path="/chatbot"
              element={
                needsHealthData ? (
                  <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                    <HealthDataPrompt onHealthDataSubmitted={handleHealthDataSubmitted} isPeriodicCheck={true} />
                  </ProtectedRoute>
                ) : (
                  <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                    <Chatbot />
                  </ProtectedRoute>
                )
              }
            />
            <Route
              path="/provider"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['provider']}>
                  <ProviderPortal />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/diseases" element={<Diseases />} />
            <Route
              path="/education"
              element={
                needsHealthData ? (
                  <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                    <HealthDataPrompt onHealthDataSubmitted={handleHealthDataSubmitted} isPeriodicCheck={true} />
                  </ProtectedRoute>
                ) : (
                  <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                    <Education />
                  </ProtectedRoute>
                )
              }
            />
            <Route
              path="/gamification"
              element={
                needsHealthData ? (
                  <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                    <HealthDataPrompt onHealthDataSubmitted={handleHealthDataSubmitted} isPeriodicCheck={true} />
                  </ProtectedRoute>
                ) : (
                  <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} allowedUserTypes={['patient']}>
                    <Gamification />
                  </ProtectedRoute>
                )
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from './context/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './components/auth/Profile';
import PrivateRoute from './components/auth/PrivateRoute';
import ErrorBoundary from './ErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import ContactUs from './pages/Contact';
import Tca from './pages/Tca';
import PositionSizing from './pages/PositionSizing';
import OptionChain from './pages/OptionChain';
import NotFound from './pages/NotFound';
import MainLayout from './layouts/MainLayout';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Router>
        <div className={theme === 'dark' ? 'dark' : 'light'}>
          <ToastContainer position="top-right" />
          <Routes>
            {/* Auth Routes - No Layout */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} 
            />

            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
              {/* Public Routes */}
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<ContactUs />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/option-chain" element={<OptionChain />} />
                <Route path="/position-sizing" element={<PositionSizing />} />
                <Route path="/tca" element={<Tca />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

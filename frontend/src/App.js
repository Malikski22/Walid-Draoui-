import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import BookingsPage from './pages/BookingsPage';
import BusSearchPage from './pages/BusSearchPage';
import BusTripsPage from './pages/BusTripsPage';
import BusTripDetailPage from './pages/BusTripDetailPage';
import BusBookingsPage from './pages/BusBookingsPage';
import RentalsPage from './pages/RentalsPage';
import RentalDetailPage from './pages/RentalDetailPage';
import PaymentPage from './pages/PaymentPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import './App.css';

// Protected route component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user from localStorage on app initialization
  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse user from localStorage');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner border-4 border-t-blue-700 border-r-transparent border-b-transparent border-l-transparent rounded-full w-16 h-16 mx-auto animate-spin"></div>
      </div>
    );
  }
  
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar user={user} onLogout={handleLogout} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage isLogin={true} setUser={setUser} />} />
              <Route path="/register" element={<AuthPage isLogin={false} setUser={setUser} />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/hotels/:id" element={<HotelDetailPage user={user} />} />
              <Route 
                path="/bookings" 
                element={
                  <ProtectedRoute user={user}>
                    <BookingsPage user={user} />
                  </ProtectedRoute>
                } 
              />
              
              {/* Bus Routes */}
              <Route path="/bus" element={<BusSearchPage />} />
              <Route path="/bus/trips" element={<BusTripsPage />} />
              <Route path="/bus/trips/:id" element={<BusTripDetailPage user={user} />} />
              <Route 
                path="/bus/bookings" 
                element={
                  <ProtectedRoute user={user}>
                    <BusBookingsPage user={user} />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rentals Routes */}
              <Route path="/rentals" element={<RentalsPage />} />
              <Route path="/rentals/:id" element={<RentalDetailPage user={user} />} />
              
              {/* Payment Route */}
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute user={user}>
                    <PaymentPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Static Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </I18nextProvider>
  );
};

export default App;

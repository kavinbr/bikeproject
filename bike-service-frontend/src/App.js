import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import OtpEntry from './pages/OtpEntry';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BookService from './components/Booking/BookService';
import BookingList from './components/Booking/BookingList';
import ServiceForm from './components/Owner/ServiceForm';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ServiceProvider } from './context/ServiceContext';
import ServiceDetails from './components/Services/ServiceDetails';

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleCloseRegisterModal = () => setShowRegisterModal(false);
  const handleShowRegisterModal = () => setShowRegisterModal(true);

  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <ServiceProvider>
            <div className="App">
              <Routes>
                <Route exact path="/" element={<HomePage handleShowLoginModal={handleShowLoginModal} />} />
                <Route exact path="/profile" element={<ProfilePage />} />
                <Route exact path="/book-service" element={<BookService />} />
                <Route exact path="/booking-list" element={<BookingList />} />
                <Route exact path="/add-service" element={<ServiceForm />} />
                <Route exact path="/dashboard/:city" element={<OwnerDashboard />} />
                <Route path="/service/:id" element={<ServiceDetails />} />
                <Route path="/otp-entry" element={<OtpEntry />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              {/* Login Modal */}
              <Login show={showLoginModal} handleClose={handleCloseLoginModal} />

              {/* Register Modal */}
              <Register show={showRegisterModal} handleClose={handleCloseRegisterModal} />
            </div>
          </ServiceProvider>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;



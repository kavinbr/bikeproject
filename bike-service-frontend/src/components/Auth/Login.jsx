import React, { useReducer, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Register from './Register';
import './Login.css';

const Login = ({ show, handleClose, handleLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState(''); 
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const baseUrl = "https://bike-mx9b.onrender.com"
  const owners = [
    { email: 'kavinbr.20msc@kongu.edu', password: 'MSC@KONGU', city: 'erode' },
    { email: 'yokeshr.20msc@kongu.edu', password: 'Dhivya753@', city: 'gobi' },
   
  ];

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
    resetForm();
  };

  const handleShowRegisterModal = () => setShowRegisterModal(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !city) {
      setError('Email, password, and city are required');
      return;
    }

    try {
      const owner = owners.find(owner => owner.email === email && owner.password === password && owner.city === city);
      if (owner) {
       
        localStorage.setItem('ownerEmail', owner.email);
        localStorage.setItem('ownerCity', owner.city);
        navigate(`/dashboard/${city}`); 
      } else {
        const response = await axios.post(baseUrl + '/api/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userCity', city); 
        console.log(`Logged in as user in city: ${city}`);
        handleLoginSuccess(); 
        handleClose();
        resetForm();
      }
    } catch (error) {
      setError('Invalid email, password, or city');
    }
  };
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setCity(''); 
    setError('');
  };

  const handleRegisterClick = () => {
    handleClose();
    handleShowRegisterModal();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="login-modal">
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="login-form">
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="underline-input"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="underline-input"
              />
            </Form.Group>
            <Form.Group controlId="formBasicCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                as="select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="underline-input"
              >
                <option value="">Select your city</option>
                {owners.map((owner, index) => (
                  <option key={index} value={owner.city}>{owner.city}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="login-btn">
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={handleRegisterClick}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Register Modal */}
      <Register show={showRegisterModal} handleClose={handleCloseRegisterModal} />
    </>
  );
};

export default Login;




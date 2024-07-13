import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = forwardRef(({ show, handleClose }, ref) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNumber)) {
      setError('Mobile number is invalid. Please enter a 10-digit number starting with 9, 8, 7, or 6.');
      return;
    }

    
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W\_])[a-zA-Z0-9\W\_]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password is invalid. It should be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special symbol.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, mobileNumber, password });
      navigate('/');
      handleModalClose();
    } catch (error) {
      setError('User already exists.');
    }
  };

  const resetForm = () => {
    setEmail('');
    setMobileNumber('');
    setPassword('');
    setError('');
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  
  useImperativeHandle(ref, () => ({
    resetForm
  }));

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleRegister}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               className="underline-input"
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicMobileNumber">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
               className="underline-input"
              required
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
              required
            />
            <Form.Text className="text-muted">
              Password should be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special symbol.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <p>
          Already have an account?{' '}
          <Button variant="link" onClick={handleModalClose}>
            Login
          </Button>
        </p>
      </Modal.Footer>
    </Modal>
  );
});

export default Register;


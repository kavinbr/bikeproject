import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import './OtpEntry.css'; 

const OtpEntry = ({ generatedOTP, userId, onClose, onSuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    console.log('verify otp:', enteredOtp);
    console.log('verify generated otp:', generatedOTP);
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      };

      const response = await axios.post('http://localhost:5000/api/otp/verify', { userId, otp: enteredOtp, generatedOTP }, config);

      if (response.status === 200) {
        
        onSuccess();
        onClose(); // Close the modal
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Error verifying OTP');
    }
  };

  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <div className="otp-input-container">
              {otp.map((data, index) => {
                return (
                  <input
                    className="otp-input"
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={e => handleChange(e.target, index)}
                    onFocus={e => e.target.select()}
                    ref={el => (inputRefs.current[index] = el)}
                  />
                );
              })}
            </div>
            {error && <p className="text-danger">{error}</p>}
            <Button type="submit" variant="primary" className="mt-3">
              Verify OTP
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default OtpEntry;

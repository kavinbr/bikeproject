import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import './ServiceDetails.css';
import { AuthContext } from '../../context/AuthContext';
import OtpEntry from '../../pages/OtpEntry';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const { loggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log('user_id:', id);
  console.log('user:', user);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleBookNow = async () => {
    if (!loggedIn || !user || !user._id) {
      console.error('User is not logged in');
      navigate('/login'); 
      return;
    }

    try {
      const userId = user._id;
      const response = await axios.post('http://localhost:5000/api/otp/generate', { userId });
      const generatedOTP = response.data.otp; 
      setGeneratedOTP(generatedOTP);
      setShowOtpModal(true);
    } catch (error) {
      console.error('Error generating OTP:', error);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false); 
    navigate('/book-service', { state: { service, user } }); 
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  if (!service) {
    return <div>Loading...</div>;
  }

  const imageName = service.image ? service.image.split('\\').pop() : 'No Image';

  let mainDescription = '';
  let whatIncluded = [];

  if (service.description.includes('What Included:')) {
    const parts = service.description.split('What Included:');
    mainDescription = parts[0].trim();
    const includedSection = parts[1].trim();
    whatIncluded = includedSection.split('.').map((item, index) => {
      const trimmedItem = item.trim();
      const colonIndex = trimmedItem.indexOf(':');
      if (colonIndex !== -1) {
        const beforeColon = trimmedItem.substring(0, colonIndex + 1);
        const afterColon = trimmedItem.substring(colonIndex + 1).trim();
        return (
          <li key={index}>
            <strong>{beforeColon}</strong> {afterColon}
          </li>
        );
      }
      return null;
    });
  } else {
    mainDescription = service.description;
  }

  return (
    <Container className="mt-5 service-details-container">
      <Card className="shadow service-details-card">
        <Row noGutters>
          <Col md={4} className="d-flex align-items-center justify-content-end pr-4">
            {service.image && (
              <div>
                <img
                  src={`http://localhost:5000/${imageName}`}
                  alt={service.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}
          </Col>
          <Col md={8} className="d-flex flex-column justify-content-center p-4">
            <h2 className="service-details-title">{service.name}</h2>
            <p className="service-details-description">Description:</p>
            <p className="service-details-description">{mainDescription}</p>
            {whatIncluded.length > 0 && (
              <>
                <p className="service-details-subtitle mt-3">What Included:</p>
                <ul className="service-details-list mt-2">{whatIncluded}</ul>
              </>
            )}
            <p className="service-details-subtitle mt-3">
              <strong>Duration: </strong>
              {service.duration} hr
            </p>
            <p className="service-details-cost mt-3">Cost: {service.cost}</p>
            <Button variant="danger" className="service-details-button mt-3" onClick={handleBookNow}>
              Book Now
            </Button>
            <Button variant="danger" className="mt-3 btn btn-primary backbutton" onClick={handleGoBack}>
              Go Back
            </Button>
          </Col>
        </Row>
      </Card>

      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>OTP Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OtpEntry
            generatedOTP={generatedOTP}
            userId={id}
            onClose={() => setShowOtpModal(false)}
            onSuccess={handleOtpSuccess}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ServiceDetails;


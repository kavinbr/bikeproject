import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, Card, Modal } from 'react-bootstrap';
import { FaClock, FaRupeeSign } from 'react-icons/fa';
import './BookService.css';

const BookService = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { service, user } = state || {};
  const [userName, setUserName] = useState('');
  const [bikeBrand, setBikeBrand] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [bikeNumber, setBikeNumber] = useState('');
  const [address, setAddress] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [problemDetails, setProblemDetails] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const baseUrl = "https://bikeservice-smo9.onrender.com";

  useEffect(() => {
    if (!service || !user) {
      navigate('/');
    }
  }, [service, user, navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    const bookingData = {
      userId: user._id,
      userName,
      service: service._id,
      bikeBrand,
      bikeModel,
      bikeNumber,
      address,
      serviceDate,
      problemDetails,
      emailMessage: `Booking for service: ${service.name} on ${serviceDate}`
    };

    try {
      const response = await axios.post(baseUrl + '/api/bookings/add', bookingData);
      console.log(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message);
      setError('Booking failed');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); // Redirect to home page after closing modal
  };

  if (!service || !user) {
    return null;
  }

  const currentDate = new Date().toISOString().split('T')[0];
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card className="shadow-lg p-3 mb-5 rounded service-booking-card">
            <Row noGutters>
              <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
                <Card.Img
                  variant="bottom"
                  src={service.image}
                  className="img-fluid rounded"
                  style={{ maxHeight: '300px', maxWidth: '1000px', objectFit: 'cover', marginLeft: '6rem' }}
                />
                <h3 className="mt-3 text-center service-name">{service.name}</h3>
                <p className="card-text">
                  <FaClock className="icon" /> <strong>Duration:</strong> {service.duration} hr
                </p>
                <p className="card-text">
                  <FaRupeeSign className="icon" /> <strong>Cost:</strong> ₹{service.cost}
                </p>
              </Col>
              <Col md={8}>
                <Card.Body className="service-details">
                  <h3 className="mt-4 text-center">Book Service</h3>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={handleBooking} className="p-4 booking-form">
                    <Row className="mb-3">
                      <Col>
                        <Form.Group controlId="formUser">
                          <Form.Label>User Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter username"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="formBikeBrand">
                          <Form.Label>Bike Brand</Form.Label>
                          <Form.Control
                            type="text"
                            value={bikeBrand}
                            onChange={(e) => setBikeBrand(e.target.value)}
                            placeholder="Enter bike brand"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col>
                        <Form.Group controlId="formBikeModel">
                          <Form.Label>Bike Model</Form.Label>
                          <Form.Control
                            type="text"
                            value={bikeModel}
                            onChange={(e) => setBikeModel(e.target.value)}
                            placeholder="Enter bike model"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="formBikeNumber">
                          <Form.Label>Bike Number</Form.Label>
                          <Form.Control
                            type="text"
                            value={bikeNumber}
                            onChange={(e) => setBikeNumber(e.target.value)}
                            placeholder="Enter bike number"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="formAddress" className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        required
                      />
                    </Form.Group>

                    <Row className="mb-3">
                      <Col>
                        <Form.Group controlId="formServiceDate">
                          <Form.Label>Service Date</Form.Label>
                          <Form.Control
                            type="date"
                            min={currentDate}
                            value={serviceDate}
                            onChange={(e) => setServiceDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="formProblemDetails">
                          <Form.Label>Problem Details</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={problemDetails}
                            onChange={(e) => setProblemDetails(e.target.value)}
                            placeholder="Describe the problem in detail"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="w-100">
                      Book Service
                    </Button>
                    <Button variant="danger" className="mt-3 btn btn-primary backbutt" onClick={handleGoBack}>
                      Go Back
                    </Button>
                  </Form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Modal for booking success */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thank you for booking {service.name} service.</p>
          <p>Please check your email for further instructions.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookService;

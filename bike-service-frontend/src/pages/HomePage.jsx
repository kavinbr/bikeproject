import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, Card, Dropdown, Button, Modal, Carousel, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ProfilePage from './ProfilePage';
import BookingList from '../components/Booking/BookingList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faRupeeSign, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './HomePage.css';
import img1 from "../assets/logo1.png"
import img2 from "../assets/profile.png"

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [services, setServices] = useState([]);
  const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  // eslint-disable-next-line
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [contactFormData, setContactFormData] = useState({
    message: ''
  });
  const baseUrl = "https://bikeproject.onrender.com"

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userLoggedIn = token ? true : false;
    setLoggedIn(userLoggedIn);

    if (userLoggedIn) {
      const city = localStorage.getItem('userCity'); 
      
      // Retrieve city from localStorage
      
      fetchServices(city);
      fetchUserDetails(token);   
    }
    // eslint-disable-next-line
  }, [setLoggedIn]);
  const fetchServices = async (city) => {
    try {
      const response = await axios.get(`${baseUrl}/api/services/get?city=${city}`);
      setServices(response.data);
      console.log(response.data); // Log response data
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userCity'); 
    setLoggedIn(false);
    setUser(null);
    setServices([]);
    setShowProfile(false);
    setShowBookingDetails(false); 
  };

  const handleLoginSuccess = async () => {
    setLoggedIn(true);
    const token = localStorage.getItem('token');
    const city = localStorage.getItem('userCity'); 
    await fetchServices(city);
    await fetchUserDetails(token);

  };

  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  // eslint-disable-next-line
  const handleShowRegisterModal = () => {
    resetRegisterForm();
    setShowRegisterModal(true);
  };
  const handleCloseRegisterModal = () => setShowRegisterModal(false);

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleViewBooking = () => {
    setShowBookingDetails(true);
  };

  const CustomDropdownToggle = React.forwardRef(({ children, onClick }, ref) => {
    const profileImgPath = img2;

    return (
      <div
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className="profile-container"
      >
        <img
          src={profileImgPath}
          alt="Profile"
          className="profile-img"
        />
      </div>
    );
  });

  const resetRegisterForm = () => {
    if (registerFormRef.current) {
      registerFormRef.current.resetForm();
    }
  };

  const registerFormRef = useRef();


   // Function to scroll to services carousel
   const scrollToServices = () => {
    const servicesSection = document.getElementById('services-carousel');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactScroll = () => {
    const contactSection = document.getElementById('contact-us-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData({ ...contactFormData, [name]: value });
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const userEmail = localStorage.getItem('userEmail'); 
      const city = localStorage.getItem('userCity'); 
      const formData = {
        userEmail,
        message: contactFormData.message,
        city,
        owneremail:'xxxx'
      };

      const response = await axios.post(`${baseUrl}/api/contact/add`, formData);

      console.log('Contact form data added to database:', response.data);
      setContactFormData({ message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
    }
  };
  return (
    <div className="home-page">
      <Container >
        <Row className="align-items-center">
          <Col md={3}>
            <img src={img1} alt="Gear-Up Garage Logo" className="logo-img" />
          </Col>
          <Col md={{ span: 1, offset: 8 }} className="contact-icon-col">
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="contact-icon" 
              onClick={handleContactScroll} 
            />
          </Col>
        </Row>
        
        {loggedIn && (
         <Row className="justify-content-center mt-4">
          <Link to="#" onClick={scrollToServices} className="visit-services-link">Visit Services</Link>
        </Row>
        )}
        <Row>
        <Col md={6} className={`content-box p-4 ${loggedIn ? 'center-content' : ''}`}>
            <h2 className={`mb-4 head ${loggedIn ? 'center-head' : ''}`}>GENERAL BIKE SERVICE IN INDIA</h2>
            <p className='content-p'>
              Keep your bike in top gear with <span className="highlighted-text">Gear-Up Garage's</span> hassle-free pickup and drop service across India.
              Book online now and let our expert mechanics handle the rest, right from your doorstep!
            </p>
          </Col>
          <Col md={6} className="login-button-container">
         
          {!loggedIn && (
          <div className="login-text">
            Login to enjoy the service
          </div>
        )}
            {loggedIn ? (
              <Dropdown>
                <Dropdown.Toggle as={CustomDropdownToggle} id="dropdown-basic" />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleViewProfile}>View Profile</Dropdown.Item>
                  <Dropdown.Item onClick={handleViewBooking}>View Booking</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : ( 
              <Button variant="success" className="login-button" onClick={handleShowLoginModal}>
                Login
              </Button>
            )}
          </Col>
        </Row>

               
        <div className={`book-easy ${loggedIn ? 'center-book' : ''}`}>
        <h className='htag'>SIMPLE &
        easy to book</h>
        <div>
        
      <Row className="justify-content-center">
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: '33%' }}></div>
          </div>
          <div className="step-number">2</div>
          <div className="step-number">3</div>
          <div className="step-number">1</div>
        </div>
      </Row>

      <Row className="justify-content-center mt-4">
        <div className="step-container">
          <div className="step">
            <div className="step-title">Select your Bike Model</div>
          </div>
          <div className="step">
            <div className="step-title">Book the Service</div>
          </div>
          <div className="step">
            <div className="step-title">Get the service done with Free pickup & Drop</div>
          </div>
        </div>
      </Row>
    </div>
</div>


        {/* Login Modal */}
        <Login show={showLoginModal} handleClose={handleCloseLoginModal} handleLoginSuccess={handleLoginSuccess} />

        {/* Register Modal */}
        <Register ref={registerFormRef} show={showRegisterModal} handleClose={handleCloseRegisterModal} />

        {/* Display Services Carousel if logged in and not owner */}
        {loggedIn && services.length > 0 && !showProfile && (
          <Container id="services-carousel" className="mt-5 services-carousel">
            <h3 className="mb-4 service-head">Our Services</h3>
            <Carousel>
              {services.map((service) => {
               

               
                const endIndex = service.description.indexOf('What Included');

              
                const truncatedDescription = endIndex !== -1 ? service.description.substring(0, endIndex) : service.description;

                return (
                  <Carousel.Item key={service._id} className="carousel-item">
                    <Card className="service-card">
                      <div className="row">
                      <div className="col-md-6">
                      <Card.Body className="card-body">
                        <Card.Title className="service-name">{service.name}</Card.Title>
                            <div className="card-details">
                              <div className="left-details">
                                 <Card.Text>
                                 <FontAwesomeIcon icon={faRupeeSign} className="icon-space" /> {service.cost}
                                </Card.Text>
                                <Card.Text>
                        <FontAwesomeIcon icon={faClock} className="icon-space" /> {service.duration} hr
                     </Card.Text>
                  </div>

      <div className="bottom-details">
        <Card.Text className="desc">{truncatedDescription}</Card.Text>
        <Link to={`/service/${service._id}`} className="btn btn-warning">
          View Details
        </Link>
      </div>
    </div>
  </Card.Body>
</div>

                        <div className="col-md-6 d-flex align-items-center justify-content-center">
                          <Card.Img variant="top" src={ service.image} className="card-img-top img-fluid" />
                        </div>
                      </div>
                    </Card>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Container>
        )}

        {/* Display ProfilePage if showProfile is true */}
        {showProfile && <ProfilePage user={user} handleLogout={handleLogout} setShowProfile={setShowProfile} />}

        {/* Modal for Booking Details */}
        <Modal
  className="book-details"
  show={showBookingDetails}
  onHide={() => setShowBookingDetails(false)}
  dialogClassName="custom-modal-width" // Add this line
>
  <Modal.Header closeButton>
    <Modal.Title>Booking Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <BookingList setSelectedBooking={setSelectedBooking} />
  </Modal.Body>
</Modal>


 {/* Contact Us Section */}
  <Row className="contact-us-section mt-5" id="contact-us-section">
          {/* Address Section */}
          <Col md={6}>
            <h3 className='contact-h'>Contact Us</h3>
            <p className='ptag'>123 Gear-Up Garage Street,</p>
            <p className='ptag'>Erode, TamilNadu, 638315</p>
            <p className='ptag'>India</p>
          </Col>

          {/* Message Form Section */}
          <Col md={6}>
            <Form onSubmit={handleContactFormSubmit}>
              <Form.Group controlId="formMessage">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Your Message"
                  name="message"
                  value={contactFormData.message}
                  onChange={handleContactFormChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default HomePage;


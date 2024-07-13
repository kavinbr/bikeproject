


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form,Alert, Table } from 'react-bootstrap';
import './Owner.css'; 
import {useNavigate } from 'react-router-dom';


const OwnerDashboard = () => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceCost, setServiceCost] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [serviceImage, setServiceImage] = useState(null); 
  const [services, setServices] = useState([]);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false); 
  const [editService, setEditService] = useState(null); 
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState('');
  const [showMessagesModal, setShowMessagesModal] = useState(false); 
  const [contactMessages, setContactMessages] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const navigate = useNavigate();

  const baseUrl = "https://bike-mx9b.onrender.com";
  const ownerEmail = localStorage.getItem('ownerEmail'); 
  const city = localStorage.getItem('ownerCity');  

  console.log("Owner Email:", ownerEmail); 
  console.log("City:", city);  

  useEffect(() => {
    if (ownerEmail && city) {
      fetchBookings(city);
      fetchServices();
    }
  }, [ownerEmail, city]);


  useEffect(() => {
    filterBookings();
  }, [searchTerm, bookings]);


  const handleShowAddServiceModal = () => setShowAddServiceModal(true);

  const handleCloseServicesModal = () => {
    setShowServicesModal(false);
    setEditService(null); 
    
    
  };

  const handleCloseAddServiceModal = () => {
    setShowAddServiceModal(false);
    resetForm();
  };

  const resetForm = () => {
    setServiceName('');
    setServiceDescription('');
    setServiceCost('');
    setServiceDuration('');
    setServiceImage(null);
    setError('');
  };
  const handleShowServicesModal = () => setShowServicesModal(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit. Please upload a smaller image.');
      setServiceImage(null);
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setServiceImage(reader.result);
        setError(''); 
      };
    }
   
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/services?ownerEmail=${ownerEmail}&city=${city}`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    
    const formData = new FormData();
    formData.append('name', serviceName);
    formData.append('description', serviceDescription);
    formData.append('cost', serviceCost);
    formData.append('duration', serviceDuration);
    formData.append('ownerEmail', ownerEmail);
    formData.append('city', city);
    formData.append('image', serviceImage);
  
    try {
      const response = await axios.post(`${baseUrl}/api/services/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Service added successfully:', response.data);
      setServices([...services, response.data]);
      handleCloseAddServiceModal();
  
    } catch (error) {
      console.error('Error adding service:', error.response);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError('Failed to add service. Please try again later.');
      }
    
  
    }
  };
  
  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(`${baseUrl}/api/services/${serviceId}`);
      setServices(services.filter(service => service._id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEditService = (service) => {
    setEditService(service);
    setShowEditServiceModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditServiceModal(false);
    setEditService(null); 
  };

  const handleEditModalSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', editService.name);
    formData.append('description', editService.description);
    formData.append('cost', editService.cost);
    formData.append('duration', editService.duration);
    formData.append('ownerEmail', ownerEmail);
    formData.append('city', city);
    if (serviceImage) {
      formData.append('image', serviceImage); 
    }

    try {
      const response = await axios.put(
        `${baseUrl}/api/services/${editService._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Service updated successfully:', response.data);
      const updatedServices = services.map((service) =>
        service._id === editService._id ? response.data : service
      );
      setServices(updatedServices);
      handleEditModalClose(); 
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const fetchBookings = async (city) => {
    try {
      const response = await axios.get(`${baseUrl}/api/bookings?city=${city}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const toggleBookingDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const updateBookingStatus = async (status) => {
    try {
      if (!selectedBooking || !selectedBooking._id) {
        console.error('Selected booking is null or missing _id.');
        return;
      }

      await axios.put(`${baseUrl}/api/bookings/${selectedBooking._id}`, { status });
      console.log(`Booking status updated to ${status} successfully.`);
      
     
      const updatedBookings = bookings.map(booking =>
        booking._id === selectedBooking._id ? { ...booking, status } : booking
      );
      setBookings(updatedBookings);
      setSelectedBooking(null);
    } catch (error) {
      console.error(`Error updating booking status to ${status}:`, error);
    }
  };
  const handleStatusUpdate = (status) => {
    if (selectedBooking) {
      console.log('Selected Booking:', selectedBooking);
      updateBookingStatus(status);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ownerEmail');
    localStorage.removeItem('ownerCity');
    navigate('/');
  };


  const truncateDescription = (description) => {
    const index = description.indexOf('What Included');
    return index !== -1 ? description.substring(0, index) : description;
  };
  const handleViewMessages = async () => {
    try {
      const ownerEmail = localStorage.getItem('ownerEmail');  
       const city = localStorage.getItem('ownerCity'); 
      const response = await axios.get(`${baseUrl}/api/contact?owneremail=${ownerEmail}&city=${city}`);
      console.log(response.data);
      setContactMessages(response.data);
      setShowMessagesModal(true);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  const handleCloseMessagesModal = () => {
    setShowMessagesModal(false);
    setContactMessages([]);
  };

  const filterBookings = () => {
    const filtered = bookings.filter((booking) => {
      const term = searchTerm.toLowerCase();
      return (
        (booking.serviceName && booking.serviceName.toLowerCase().includes(term)) ||
        (booking.userName && booking.userName.toLowerCase().includes(term)) ||
        (booking.userEmail && booking.userEmail.toLowerCase().includes(term)) ||
        (booking.serviceDate && new Date(booking.serviceDate).toLocaleDateString().includes(term)) ||
        (booking.status && booking.status.toLowerCase().includes(term))
      );
    });
    setFilteredBookings(filtered);
  };
  return (
    <div className="owner-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button variant="primary" onClick={handleShowAddServiceModal}>
            Add Service
          </Button>

          <Button variant="secondary" className="ml-2" onClick={handleShowServicesModal}>
            View Services
          </Button>
          <Button variant="info" className="ml-2" onClick={handleViewMessages}>
            View Messages
          </Button>
        </div>
        <Button variant="danger" onClick={handleLogout} className='btn-logout'>
          Logout
        </Button>
      </div>
      <Modal show={showAddServiceModal} onHide={handleCloseAddServiceModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="serviceName">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter service name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="serviceDescription">
              <Form.Label>Service Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter service description"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="serviceCost">
              <Form.Label>Service Cost</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter service cost"
                value={serviceCost}
                onChange={(e) => setServiceCost(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="serviceDuration">
              <Form.Label>Service Duration</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter service duration (hours)"
                value={serviceDuration}
                onChange={(e) => setServiceDuration(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="serviceImage">
              <Form.Label>Service Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Service
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showServicesModal} onHide={handleCloseServicesModal} size="lg">
         <Modal.Header closeButton>
           <Modal.Title>View Services</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <Table striped bordered hover>
             <thead>
               <tr>
                 <th>Name</th>
                 <th>Description</th>
                 <th>Cost</th>
                 <th>Duration</th>
                 <th>Image</th>
                 <th style={{ width: '150px' }}>Actions</th>
               </tr>
             </thead>
             <tbody>
               {services.map((service) => {
                 const imageName = service.image ? service.image.split('\\').pop() : 'No Image';
                 return (
                  <tr key={service._id}>
                    <td>{service.name}</td>
                    <td>{truncateDescription(service.description)}</td>
                    <td>{service.cost}</td>
                    <td>{service.duration}</td>
                    <td>
                      <img
                      
                      src={`${baseUrl}/${imageName}`} 
                        alt={service.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <Button variant="warning" className="mr-2" onClick={() => handleEditService(service)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteService(service._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showEditServiceModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditModalSubmit}>
            <Form.Group controlId="editServiceName">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter service name"
                value={editService?.name || ''}
                onChange={(e) =>
                  setEditService({ ...editService, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="editServiceDescription">
              <Form.Label>Service Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter service description"
                value={editService?.description || ''}
                onChange={(e) =>
                  setEditService({
                    ...editService,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="editServiceCost">
              <Form.Label>Service Cost</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter service cost"
                value={editService?.cost || ''}
                onChange={(e) =>
                  setEditService({ ...editService, cost: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="editServiceDuration">
              <Form.Label>Service Duration</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter service duration (hours)"
                value={editService?.duration || ''}
                onChange={(e) =>
                  setEditService({ ...editService, duration: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="editServiceImage">
              <Form.Label>Service Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Service
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="search-bar-container mb-3">
        <Form.Control
          type="text"
          placeholder="Search by username, email, date, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-container">
        <h2>Bookings</h2>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Customer Name</th>
              <th>Service Date</th>
              <th>Status</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.serviceName}</td>
                <td>{booking.userName}</td>
                <td>{new Date(booking.serviceDate).toLocaleDateString()}</td>
                <td>{booking.status}</td>
                <td>
                  <Button
                    variant="info"
                    className="mr-2"
                    onClick={() => toggleBookingDetails(booking)}
                  >
                    View
                  </Button>
                  {booking.status === 'completed' ? (
                    <span
                      className="status-indicator tick-mark"
                      title={`Status: ${booking.status}`}
                    ></span>
                  ) : (
                    <span
                      className={`status-indicator ${booking.status.toLowerCase()}`}
                    ></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  

    <Modal show={showMessagesModal} onHide={handleCloseMessagesModal}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Messages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {contactMessages.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>City</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {contactMessages.map((message) => (
                  <tr key={message._id}>
                    <td>{message.userEmail}</td>
                    <td>{message.city}</td>
                    <td>{message.message}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No messages found.</p>
          )}
        </Modal.Body>
      </Modal>


       <Modal show={!!selectedBooking} onHide={() => setSelectedBooking(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  {selectedBooking && (
    <div className="booking-details">
      <h3>Booking Details</h3>
      <p><strong>Service Name:</strong> {selectedBooking.serviceName}</p>
      <p><strong>Customer Name:</strong> {selectedBooking.userName}</p>
      <p><strong>Mobile Number:</strong> {selectedBooking.mobileNumber}</p>
      <p><strong>Bike Brand:</strong> {selectedBooking.bikeBrand}</p>
      <p><strong>Bike Model:</strong> {selectedBooking.bikeModel}</p>
      <p><strong>Bike Number:</strong> {selectedBooking.bikeNumber}</p>
      <p><strong>Address:</strong> {selectedBooking.address}</p>
      <p><strong>Service Date:</strong> {new Date(selectedBooking.serviceDate).toLocaleDateString()}</p>
      <p><strong>Problem Details:</strong> {selectedBooking.problemDetails}</p>
      <p><strong>Status:</strong> {selectedBooking.status}</p>
      <div className="mt-3">
        {selectedBooking.status === 'pending' && (
          <>
            <Button variant="success" onClick={() => handleStatusUpdate('accepted')}>
              Accept
            </Button>
            <Button variant="danger" onClick={() => handleStatusUpdate('rejected')} className="ml-2">
              Reject
            </Button>
          </>
        )}
        {selectedBooking.status === 'accepted' && (
          <Button variant="warning" onClick={() => handleStatusUpdate('ready')}>
            Ready for Delivery
          </Button>
        )}
        {selectedBooking.status === 'ready' && (
          <Button variant="primary" onClick={() => handleStatusUpdate('completed')}>
            Completed
          </Button>
        )}
      </div>
    </div>
  )}
</Modal.Body>

      </Modal>
      </div>
      </div>
  );
};

export default OwnerDashboard;


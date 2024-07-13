import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Table } from 'react-bootstrap';
import './BookingList.css';

const BookingList = ({ setSelectedBooking }) => {
  const { loggedIn, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const userEmail = localStorage.getItem('userEmail');
  const ownerEmail = localStorage.getItem('ownerEmail');
  const city = localStorage.getItem('ownerCity');  
  const usercity = localStorage.getItem('userCity'); 
  console.log("Owner Email:", userEmail); 
  console.log("City:", usercity);  
  const baseUrl = "https://bikeproject.onrender.com";
  useEffect(() => {
    if (usercity) {
      fetchBookings();
    }
  }, [userEmail, usercity]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(baseUrl + `/api/bookings/user?email=${userEmail}&city=${usercity}`);
      setBookings(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
  };

  return (
    <div className="booking-list-container">
      <h2>Booking List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Customer Name</th>
            <th>Email Message</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} onClick={() => handleSelectBooking(booking)}>
              <td>{booking.serviceName}</td>
              <td>{booking.userName}</td>
              <td>{booking.emailMessage}</td>
              <td>{booking.status}</td>
              
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingList;

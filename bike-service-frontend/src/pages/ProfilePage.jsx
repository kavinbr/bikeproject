import React from 'react';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = ({ user, handleLogout, setShowProfile }) => {
  if (!user) {
    return <p>Loading...</p>; 
  }

  const username = user.email.substring(0, user.email.indexOf('@'));


  const formattedMobileNumber = user.mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

  const handleBackToHomepage = () => {
    setShowProfile(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Profile Details</h2>
              <div className="profile-details">
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Mobile:</strong> {formattedMobileNumber}</p>
                
              </div>
              <div className="button-group">
                <button className="btn btn-danger mr-3 log" onClick={handleLogout}>Logout</button>
                <Link to="/" className="btn btn-primary" onClick={handleBackToHomepage}>Back</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

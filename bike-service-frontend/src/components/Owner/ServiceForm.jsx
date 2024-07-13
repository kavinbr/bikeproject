import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ServiceForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [error, setError] = useState('');

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/services', { name, description, cost });
      navigate('/dashboard'); // Redirect to dashboard after adding service
    } catch (error) {
      setError('Failed to add service');
    }
  };

  return (
    <div>
      <h2>Add Service</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleAddService}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter service name"
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter service description"
            required
          />
        </div>
        <div>
          <label>Cost:</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Enter service cost"
            required
          />
        </div>
        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default ServiceForm;

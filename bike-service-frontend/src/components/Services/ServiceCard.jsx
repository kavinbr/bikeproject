import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div>
      <h3>{service.name}</h3>
      <p>Description: {service.description}</p>
      <p>Cost: ${service.cost}</p>
      {/* Additional details */}
    </div>
  );
};

export default ServiceCard;

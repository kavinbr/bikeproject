const Service = require('../models/Service');
const path = require('path');
const multer = require('multer');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save uploads to 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

//Get service for owner based on ownerEmail and city

const getServices = async (req, res) => {
  try {
    const { ownerEmail, city } = req.query;
    const services = await Service.find({ ownerEmail, city });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get service for customer by using city

const getServicesUser = async (req, res) => {
  try {
    const { city } = req.query;
    const services = await Service.find({ city });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//Get service by  by Service id

const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//Add Service to Service Database

const addService = async (req, res) => {
  const { name, description, cost, duration, ownerEmail, city } = req.body;
  let { image } = req.body;// If you're sending the image path in the body, use this; otherwise use req.file.path

  console.log('Adding service:');
  console.log('Owner Email:', ownerEmail);
  console.log('Service Name:', name);

  try {
    const existingService = await Service.findOne({ name, ownerEmail });
    if (existingService) {
      return res.status(400).json({ message: 'Service with the same name already exists for this owner' });
    }

    // Check if image exceeds 5MB
    if (req.file && req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image size exceeds 5MB limit. Please upload a smaller image.' });
    }

    // If using multer to handle file uploads, req.file will be available
    // Use req.file.path if you're storing the path to the image in the database
    if (req.file) {
      image = req.file.path; // Update image path based on multer configuration
    }

    const service = await Service.create({ name, description, cost, duration, image, ownerEmail, city });
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ error: error.message });
  }
};


//Update the service by owner 

const updateService = async (req, res) => {
    const { id } = req.params;
    const { name, description, cost, duration ,ownerEmail, city} = req.body;
    const image = req.file ? req.file.path : undefined;
  
    try {
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      service.name = name;
      service.description = description;
      service.cost = cost;
      service.duration = duration;
      service.ownerEmail =ownerEmail;
      service.city =city;
      if(image) {
        service.image = image;
      }
  
      const updatedService = await service.save();
      res.json(updatedService);
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

//Delete the service by id  

const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await Service.findByIdAndDelete(id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getServices,
  getServicesUser,
  getServiceById,
  addService,
  updateService,
  deleteService,
};

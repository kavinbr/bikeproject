const express = require('express');
const { getServiceById, getServices, getServicesUser, addService, updateService, deleteService } = require('../controllers/serviceController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

router.get('/', getServices);
router.get('/get', getServicesUser);
router.get('/:id', getServiceById); // This is the route for fetching service by ID
router.post('/add', upload.single('image'), addService);
router.put('/:id', upload.single('image'), updateService);
router.delete('/:id', deleteService);

module.exports = router;







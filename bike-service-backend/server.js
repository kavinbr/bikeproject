const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otp');
const contactRoutes = require('./routes/contactRoutes');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

dotenv.config();

connectDB();

const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./backend/uploads/')); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    fieldNameSize: 200, // Limit field name length
    fieldSize: 260 * 260 // Limit field value length (1MB)
  }
});

app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/contact', contactRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'bike-service-backend', 'backend', 'uploads')));

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    res.json({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size should be less than 5MB' });
    }
  }
  next(err);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

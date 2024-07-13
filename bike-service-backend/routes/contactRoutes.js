const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {  addcontact ,getcontact} = require('../controllers/contactController');

router.post('/add',addcontact);
router.get('/', getcontact);
module.exports = router;

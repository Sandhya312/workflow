const express = require("express");
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Replace 'uploads/' with your desired destination
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original file name
  }
});

const upload = multer({ storage: storage });


const router = express.Router();
const {
    saveWorkflow,
    executionFlow
}  = require('../controllers/workflowController');

router.post('/',saveWorkflow);

router.post('/execute', upload.single('file'), executionFlow);

module.exports = router;
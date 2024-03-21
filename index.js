require('dotenv').config();

const express = require('express');

const port = process.env.PORT || 5000;
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const workflowRoutes = require('./routes/workflowRoutes');
const path = require('path');
connectDB();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors("Access-Control-Allow-Origin:*")); // Enable CORS for all origins
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/workflow',workflowRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

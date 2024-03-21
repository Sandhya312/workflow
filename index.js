require('dotenv').config();

const express = require('express');

const port = process.env.PORT || 5000;
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const workflowRoutes = require('./routes/workflowRoutes');

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors("Access-Control-Allow-Origin:*")); // Enable CORS for all origins

app.use('/workflow',workflowRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

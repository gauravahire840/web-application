const express = require('express');
const bodyParser = require('body-parser');

const tasks = require('./routes/tasks');
const cors = require('cors');

const multer = require('multer');

const app = express();
const port = 3000;



// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/tasks', tasks);

// listner port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

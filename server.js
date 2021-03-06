// Dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');

// Ensure environment variables are set
if(!process.env.MEAN_SECRET || !process.env.MONGO_SERVER_URI) {
  console.error('Please ensure MEAN_SECRET and MONGO_SERVER_URI are set');
  process.abort();
}

// Setup mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_SERVER_URI);

const app = express();

app.use(morgan('dev'));

// post data parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup auth
app.use(passport.initialize()); // 

// Include models and passport config
require('./server/models/chirp');
require('./server/models/user');
require('./server/config/passport');

// Static Route
app.use(express.static(path.join(__dirname, 'dist')));

// API routing
require('./server/routes/index.js')(app);

// Fallback to the index page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Setup the server
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API listening on port ${port}`));
//Import packages
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');

//Create express app
const app = express();

//Set port
const PORT = process.env.PORT || 4000;


//Start server
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

//Export for testing
module.exports = app;
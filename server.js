//Import packages and modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const apiRouter = require('./api/api');

//Create express app
const app = express();

//Set port
const PORT = process.env.PORT || 4000;

//Mount api router at /api
app.use('/api', apiRouter);


//Start server
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

//Export for testing
module.exports = app;
//Import express and other routers
const express = require('express');
const apiRouter = express.Router();
const artistsRouter = require('./artists');

//Mount different route paths
apiRouter.use('/artists', artistsRouter);

module.exports = apiRouter;
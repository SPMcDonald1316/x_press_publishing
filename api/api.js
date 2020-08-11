//Import express and other routers
const express = require('express');
const apiRouter = express.Router();
const artistsRouter = require('./artists');
const seriesRouter = require('./series');

//Mount different route paths
apiRouter.use('/artists', artistsRouter);
apiRouter.use('/series', seriesRouter);

module.exports = apiRouter;
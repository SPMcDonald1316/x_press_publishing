//Create Router and Import Database
const express = require('express');
const artistsRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Router param
artistsRouter.param('artistId', (req, res, next, id) => {
  db.get('SELECT * FROM Artist WHERE id = $id', {$id: id}, (err, artist) => {
    if (err) {
      next(err);
    } else if (artist) {
      req.artist = artist;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Routes
artistsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE is_currently_employed = 1', (err, artists) => {
    if (err) {
      //If it exists pass error along the middleware chain
      next(err);
    } else {
      //Return all artists on the response object
      res.status(200).json({artists: artists});
    }
  });
});

module.exports = artistsRouter;
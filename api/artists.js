//Create Router and Import Database
const express = require('express');
const artistsRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Router param
artistsRouter.param('artistId', (req, res, next, id) => {
  db.get(`SELECT * FROM Artist WHERE id = ${id}`, (err, artist) => {
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

artistsRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({artist: req.artist});
});

artistsRouter.post('/', (req, res, next) => {
  const artist = req.body.artist;
  if (!artist.name || !artist.dateOfBirth || !artist.biography) {
    return res.sendStatus(400);
  }
  const employed = artist.isCurrentlyEmployed === 0 ? 0 : 1;
  db.run(`INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)`, {
    $name: artist.name,
    $dateOfBirth: artist.dateOfBirth,
    $biography: artist.biography,
    $isCurrentlyEmployed: employed
  }, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`, (err, artist) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json({artist: artist});
        }
      });
    }
  });
});

artistsRouter.put('/:artistId', (req, res, next) => {
  const artist = req.body.artist;
  if (!artist.name || !artist.dateOfBirth || !artist.biography) {
    return res.sendStatus(400);
  }
  db.run('UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE id = $id', {
    $name: artist.name,
    $dateOfBirth: artist.dateOfBirth,
    $biography: artist.biography,
    $isCurrentlyEmployed: artist.isCurrentlyEmployed,
    $id: req.params.artistId
  }, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Artist WHERE id = ${req.params.artistId}`, (err, artist) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({artist: artist});
        }
      });
    }
  });
});

artistsRouter.delete('/:artistId', (req, res, next) => {
  db.run(`UPDATE Artist SET is_currently_employed = 0 WHERE id = ${req.params.artistId}`, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Artist WHERE id = ${req.params.artistId}`, (err, artist) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({artist: artist});
        }
      });
    }
  });
});

module.exports = artistsRouter;
//Create router and import database
const express = require('express');
const seriesRouter = express.Router();
const issuesRouter = require('./issues');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Router Parameter
seriesRouter.param('seriesId', (req, res, next, id) => {
  db.get(`SELECT * FROM Series WHERE id = ${id}`, (err, series) => {
    if (err) {
      next(err);
    } else if (series) {
      req.series = series;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Import and mount issuesRouter
seriesRouter.use('/:seriesId/issues', issuesRouter);

//Routes
seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (err, series) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({series: series});
    }
  });
});

seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).json({series: req.series});
});

seriesRouter.post('/', (req, res, next) => {
  const series = req.body.series;
  if (!series.name || !series.description) {
    return res.sendStatus(400);
  }
  db.run('INSERT INTO Series (name, description) VALUES ($name, $description)', {
    $name: series.name,
    $description: series.description
  }, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`, (err, series) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json({series: series});
        }
      });
    }
  });
});

seriesRouter.put('/:seriesId', (req, res, next) => {
  const series = req.body.series;
  if (!series.name || !series.description) {
    return res.sendStatus(400);
  }
  db.run('UPDATE Series SET name = $name, description = $description WHERE id = $id', {
    $name: series.name,
    $description: series.description,
    $id: req.params.seriesId
  }, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Series WHERE id = ${req.params.seriesId}`, (err, series) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({series: series});
        }
      });
    }
  });
});

module.exports = seriesRouter;
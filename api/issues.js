//Instantiate Router and merge parameters
const express = require('express');
const issuesRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Router param
issuesRouter.param('issueId', (req, res, next, id) => {
  db.get(`SELECT * FROM Issue WHERE id = ${id}`, (err, issue) => {
    if (err) {
      next(err);
    } else if (issue) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Routes
issuesRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Issue WHERE series_id = ${req.params.seriesId}`, (err, issues) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({issues: issues});
    }
  });
});

issuesRouter.post('/', (req, res, next) => {
  const issue = req.body.issue;
  if (!issue.name || !issue.issueNumber || !issue.publicationDate || !issue.artistId) {
    return res.sendStatus(400);
  }
  db.get(`SELECT * FROM Artist WHERE id = ${issue.artistId}`, (err, artist) => {
    if (err) {
      next();
    } else if (artist) {
      db.run('INSERT INTO Issue (name, issue_number, publication_date, series_id, artist_id) VALUES ($name, $issueNumber, $publicationDate, $seriesId, $artistId)', {
        $name: issue.name,
        $issueNumber: issue.issueNumber,
        $publicationDate: issue.publicationDate,
        $seriesId: req.params.seriesId,
        $artistId: issue.artistId
      }, function(err) {
        if (err) {
          next(err);
        } else {
          db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`, (err, issue) => {
            if (err) {
              next(err);
            } else {
              res.status(201).json({issue: issue});
            }
          });
        }
      });
    } else {
      res.sendStatus(400);
    }
  });
});

issuesRouter.put('/:issueId', (req, res, next) => {
  const issue = req.body.issue;
  if (!issue.name || !issue.issueNumber || !issue.publicationDate || !issue.artistId) {
    return res.sendStatus(400);
  }
  db.get(`SELECT * FROM Artist WHERE id = ${issue.artistId}`, (err, artist) => {
    if (err) {
      next(err);
    } else if (artist) {
      db.run('UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId WHERE id = $id', {
        $name: issue.name,
        $issueNumber: issue.issueNumber,
        $publicationDate: issue.publicationDate,
        $artistId: issue.artistId,
        $id: req.params.issueId,
      }, (err) => {
        if (err) {
          next(err);
        } else {
          db.get(`SELECT * FROM Issue WHERE id = ${req.params.issueId}`, (err, issue) => {
            if (err) {
              next(err);
            } else {
              res.status(200).json({issue: issue});
            }
          });
        }
      });
    } else {
      res.sendStatus(400);
    }
  });
});

issuesRouter.delete('/:issueId', (req, res, next) => {
  db.run(`DELETE FROM Issue WHERE id = ${req.params.issueId}`, (err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = issuesRouter;
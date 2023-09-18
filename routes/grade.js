const express = require('express');
const router = express.Router();
const GradesAPI = require('../services/grade');
const jwt = require('jsonwebtoken');
const helper = require('../helper');

router.get('/grades', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await GradesAPI.get(req.query.page));
      } catch (err) {
        console.error(`Error while getting grades list `, err.message);
        next(err);
      }
    }
  });
});

router.post('/grades/search', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await GradesAPI.search(req.body));
      } catch (err) {
        console.error(`Error while searching grades `, err.message);
        next(err);
      }
    }
  });
});

router.post('/grades', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await GradesAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding grade`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/grades/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await GradesAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating grade `, err.message);
        next(err);
      }
    }
  });
  
});

router.delete('/grades/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await GradesAPI.deleteById(req.params.id));
      } catch (err) {
        console.error(`Error while deleting grade`, err.message);
        next(err);
      }
    }
  });
  
});

module.exports = router;
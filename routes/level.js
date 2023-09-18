const express = require('express');
const router = express.Router();
const LevelsAPI = require('../services/level');
const jwt = require('jsonwebtoken');
const helper = require('../helper');

router.get('/levels', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await LevelsAPI.get(req.query));
      } catch (err) {
        console.error(`Error while getting levels list `, err.message);
        next(err);
      }
    }
  });
});

router.post('/levels/search', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await LevelsAPI.search(req.body));
      } catch (err) {
        console.error(`Error while getting level `, err.message);
        next(err);
      }
    }
  });
});

router.post('/levels', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await LevelsAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding level`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/levels/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await LevelsAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating level `, err.message);
        next(err);
      }
    }
  });
  
});

router.delete('/levels/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await LevelsAPI.deleteById(req.params.id));
      } catch (err) {
        console.error(`Error while deleting level`, err.message);
        next(err);
      }
    }
  });
  
});

module.exports = router;
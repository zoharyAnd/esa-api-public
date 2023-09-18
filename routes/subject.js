const express = require('express');
const router = express.Router();
const SubjectsAPI = require('../services/subject');
const jwt = require('jsonwebtoken');
const helper = require('../helper');

router.get('/subjects', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await SubjectsAPI.get(req.query.page));
      } catch (err) {
        console.error(`Error while getting subjects list `, err.message);
        next(err);
      }
    }
  });
});

router.post('/subjects/search', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await SubjectsAPI.search(req.body));
      } catch (err) {
        console.error(`Error while getting subject `, err.message);
        next(err);
      }
    }
  });
});

router.post('/subjects', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await SubjectsAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding subject`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/subjects/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await SubjectsAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating subject `, err.message);
        next(err);
      }
    }
  });
  
});

router.delete('/subjects/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await SubjectsAPI.deleteById(req.params.id));
      } catch (err) {
        console.error(`Error while deleting subject`, err.message);
        next(err);
      }
    }
  });
  
});

module.exports = router;
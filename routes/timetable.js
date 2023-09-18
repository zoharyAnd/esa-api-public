const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const helper = require('../helper');
const TimetableAPI = require('../services/timetable');

router.get('/timetable', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await TimetableAPI.get(req.query.page, req.query.from, req.query.to, req.query.level));
      } catch (err) {
        console.error(`Error while getting users `, err.message);
        next(err);
      }
    }
  });
  
});

router.post('/timetable', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await TimetableAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding timetable entry`, err.message);
        next(err);
      }
    }
  });
});

router.put('/timetable/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await TimetableAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating timetable entry`, err.message);
        next(err);
      }    
    }
  });
  
});

router.delete('/timetable/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await TimetableAPI.deleteById(req.params.id));
      } catch (err) {
        console.error(`Error while deleting timetable entry`, err.message);
        next(err);
      }      
    }
  });
});

module.exports = router;
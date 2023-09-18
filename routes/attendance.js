const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const helper = require('../helper');
const AttendanceAPI = require('../services/attendance');

router.get('/attendances', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await AttendanceAPI.get(req.query.page));
      } catch (err) {
        console.error(`Error while getting Attendance list `, err.message);
        next(err);
      }
    }
  });
});

router.get('/attendances/search', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await AttendanceAPI.search(req.query));
      } catch (err) {
        console.error(`Error while getting attendances `, err.message);
        next(err);
      }
    }
  });
});

router.post('/attendance', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await AttendanceAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding attendance`, err.message);
        next(err);
      }
    }
  });
});

router.put('/attendance/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await AttendanceAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating attendance `, err.message);
        next(err);
      }
    }
  });
});

router.delete('/attendance/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await AttendanceAPI.deleteById(req.params.id));
      } catch (err) {
        console.error(`Error while deleting attendance`, err.message);
        next(err);
      }
    }
  });
});

router.post('/attendance/stats', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await AttendanceAPI.getStats(req.body));
      } catch (err) {
        console.error(`Error while GEtting attendance stats`, err.message);
        next(err);
      }
    }
  });
});

module.exports = router;
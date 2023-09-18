const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const helper = require('../helper');
const TermAPI = require('../services/term');

router.get('/terms', async function(req, res, next) {
  try {
    res.json(await TermAPI.get(req.query.schoolYear));
  } catch (err) {
    console.error(`Error while getting terms `, err.message);
    next(err);
  }
});

router.get('/schoolYears', async function(req, res, next) {
  try {
    res.json(await TermAPI.getSchoolYears());
  } catch (err) {
    console.error(`Error while getting school years `, err.message);
    next(err);
  }
});

router.post('/terms/:schoolYear', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await TermAPI.add(req.params.schoolYear, req.body));
      } catch (err) {
        console.error(`Error while adding terms`, err.message);
        next(err);
      }
    }
  });
});

router.put('/terms/:schoolYear', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await TermAPI.update(req.params.schoolYear, req.body));
      } catch (err) {
        console.error(`Error while updating terms `, err.message);
        next(err);
      }
    }
  });
});

module.exports = router;
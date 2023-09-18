const express = require('express');
const router = express.Router();
const PricesAPI = require('../services/price');
const jwt = require('jsonwebtoken');
const helper = require('../helper');

router.get('/prices', async function(req, res, next) {
  try {
  // make this route public
    res.json(await PricesAPI.getAll());
  } catch (err) {
    console.error(`Error while getting prices list `, err.message);
    next(err);
  }
});

router.post('/prices/search', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {

        res.json(await PricesAPI.search(req.body));
      } catch (err) {
        console.error(`Error while getting prices list `, err.message);
        next(err);
      }
    }
  });
});

router.post('/prices', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await PricesAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding price`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/prices/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await PricesAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating price `, err.message);
        next(err);
      }
    }
  });
  
});

router.delete('/prices/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await PricesAPI.deleteById(req.params.id));
      } catch (err) {
        console.error(`Error while deleting price`, err.message);
        next(err);
      }
    }
  });
});

module.exports = router;
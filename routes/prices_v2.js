const express = require('express');
const router = express.Router();
const PricesAPI = require('../services/prices_v2');
const jwt = require('jsonwebtoken');
const helper = require('../helper');

router.get('/prices/v2/', async function(req, res, next) {
  try {
    res.json(await PricesAPI.getAll(req.query));
  } catch (err) {
    console.error(`Error while getting prices list `, err.message);
    next(err);
  }
});

router.get('/prices/v2/invoices', async function(req, res, next) {
  try {
    res.json(await PricesAPI.getInvoicePrices());
  } catch (err) {
    console.error(`Error while getting prices list `, err.message);
    next(err);
  }
});

router.post('/prices/v2/search', helper.verifyToken, async function(req, res, next) {
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

router.post('/prices/v2/', helper.verifyToken, async function(req, res, next) {
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

router.post('/prices/v2/batch', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await PricesAPI.addMultiplePrices());
      } catch (err) {
        console.error(`Error while adding prices in batch`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/prices/v2/:id', helper.verifyToken, async function(req, res, next) {
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

router.delete('/prices/v2/:id', helper.verifyToken, async function(req, res, next) {
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
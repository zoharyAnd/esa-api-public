const express = require('express');
const router = express.Router();
const NewsAPI = require('../services/news');
const jwt = require('jsonwebtoken');
const helper = require('../helper');

router.post('/news/notif/:codeEleve', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await NewsAPI.getNbNotif(req.params.codeEleve, req.body.data));
      } catch (err) {
        console.error(`Error while getting news list `, err.message);
        next(err);
      }
    }
  });
});

router.get('/news', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {

        res.json(await NewsAPI.getAll());
      } catch (err) {
        console.error(`Error while getting news list `, err.message);
        next(err);
      }
    }
  });
});

router.post('/news/search', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {

        res.json(await NewsAPI.search(req.body));
      } catch (err) {
        console.error(`Error while getting news list `, err.message);
        next(err);
      }
    }
  });
});

router.post('/news', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await NewsAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding news`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/news/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await NewsAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating news`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/news/markAsRead/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await NewsAPI.markAsRead(req.params.id, req.body.data));
      } catch (err) {
        console.error(`Error while marking news as read`, err.message);
        next(err);
      }
    }
  });
  
});

router.delete('/news/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await NewsAPI.deleteById(req.params.id));
      } catch (err) {
        console.error(`Error while deleting news`, err.message);
        next(err);
      }
    }
  });
});

module.exports = router;
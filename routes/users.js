const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode'); 
const helper = require('../helper');

const usersAPI = require('../services/users');

// GET USER INFO USING TOKEN
router.get('/user', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      const decoded = jwt_decode(req.token); // Decoding
      const user = decoded.user[0];
      res.send({
        role: user.role,
        codeEleve: user.codeEleve,
        level: user.level,
        id: user.id,
        username: user.username,
        name: user.name,
      });
    }
  })
});

router.get('/user/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await usersAPI.searchById(req.params.id));
      } catch (err) {
        console.error(`Error while fetching user `, err.message);
        next(err);
      }
    }
  });
});

router.post('/login', async function(req, res, next) {
  try {
    const user = await usersAPI.login(req.body);
    
    if(user.length === 0 ) {
      res.sendStatus(403);
    } else {
      jwt.sign({ user }, new Buffer.from(process.env.SECRET_KEY, 'base64'), (err, token) => {
        if(err) {
          res.sendStatus(500);
        } else {
          res.json({ token });
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/users/search/:by', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await usersAPI.search(req.params.by, req.body));
      } catch (err) {
        console.error(`Error while fetching user `, err.message);
        next(err);
      }
    }
  });
});

router.post('/users/searchFull/:by', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await usersAPI.searchFull(req.params.by, req.body));
      } catch (err) {
        console.error(`Error while fetching user `, err.message);
        next(err);
      }
    }
  });
});

router.post('/users', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await usersAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding user`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/users/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await usersAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating user`, err.message);
        next(err);
      }
    }
  });
});

router.delete('/users/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await usersAPI.deleteUser(req.params.id));
      } catch (err) {
        console.error(`Error while deleting user`, err.message);
        next(err);
      }
    }
  });
  
});

module.exports = router;
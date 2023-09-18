const express = require('express');
const router = express.Router();
const InvoicesAPI = require('../services/invoice');
const jwt = require('jsonwebtoken');
const helper = require('../helper');

router.post('/invoices/search', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {

        res.json(await InvoicesAPI.search(req.body));
      } catch (err) {
        console.error(`Error while getting invoices list `, err.message);
        next(err);
      }
    }
  });
});

router.post('/invoices/generateNext', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {

        res.json(await InvoicesAPI.generateNextReference(req.body));
      } catch (err) {
        console.error(`Error while generating new reference `, err.message);
        next(err);
      }
    }
  });
});

router.post('/invoices', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await InvoicesAPI.add(req.body));
      } catch (err) {
        console.error(`Error while adding invoice`, err.message);
        next(err);
      }
    }
  });
  
});

router.put('/invoices/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await InvoicesAPI.update(req.params.id, req.body));
      } catch (err) {
        console.error(`Error while updating invoice `, err.message);
        next(err);
      }
    }
  });
  
});

router.post('/invoices/markasread', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await InvoicesAPI.markAsRead(req.body));
      } catch (err) {
        console.error(`Error while updating invoice `, err.message);
        next(err);
      }
    }
  });
  
});

// router.post('/invoices/addschoolyear', helper.verifyToken, async function(req, res, next) {
//   jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
//     if(err) {
//       res.sendStatus(401);
//     } else {
//       try {
//         res.json(await InvoicesAPI.addSchoolYearField());
//       } catch (err) {
//         console.error(`Error while adding school year field `, err.message);
//         next(err);
//       }
//     }
//   });
  
// });

// router.post('/invoices/bulkupdate', helper.verifyToken, async function(req, res, next) {
//   jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
//     if(err) {
//       res.sendStatus(401);
//     } else {
//       try {
//         res.json(await InvoicesAPI.bulkUpdate(req.body));
//       } catch (err) {
//         console.error(`Error while getting invoices list `, err.message);
//         next(err);
//       }
//     }
//   });
// });

router.delete('/invoices/:id', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        res.json(await InvoicesAPI.deleteById(req.params.id));
      } catch (err) {
        console.error(`Error while deleting invoice`, err.message);
        next(err);
      }
    }
  });
  
});

module.exports = router;
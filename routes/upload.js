const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const helper = require('../helper');
const UploadAPI = require('../services/upload');
const fs = require('fs');

// download file from firestore
router.get("/download", helper.verifyToken, async (req, res, next) => {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        // const resDownload = await UploadAPI.download(req.query);
        const resPath = req.query.path;
        const resFilename = req.query.filePath;

        res.header('Access-Control-Allow-Origin', '*');
        if (resFilename.indexOf('.doc') !== -1) {
          res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          res.setHeader('Content-Disposition', `attachment; filename=${resFilename}`);
        }

        if (resFilename.indexOf('.xls') !== -1) {
          res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', `attachment; filename=${resFilename}`);
        }

        if (resFilename.indexOf('.pdf') !== -1) {
          res.setHeader('Content-type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=${resFilename}`);
        }
        
        if (resFilename.indexOf('.jpeg') !== -1 || resFilename.indexOf('.jpg') !== -1) {
          res.setHeader('Content-type', 'image/jpeg; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; ${resFilename}`);
        }

        if (resFilename.indexOf('.png') !== -1) {
          res.setHeader('Content-type', 'image/jpeg; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; ${resFilename}`);
        }
        
        console.log('resPath in API ====> ', resPath);
        res.download(resPath);
      } catch (err) {
        console.error(`Error uploading files:`, err.message);
        next(err);
      }
    }
  });
  
});
// upload files to storage
router.post('/upload/:folder', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        const resUpload = await UploadAPI.upload(req.params.folder, req.files);
        res.send({
          data: resUpload
        });
      } catch (err) {
        console.error(`Error uploading files:`, err.message);
        next(err);
      }
    }
  });
});

// upload to subfolder in storage
router.post('/upload/:folder/:subfolder', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        const resUpload = await UploadAPI.uploadtoSubfolder(req.params.folder, req.params.subfolder, req.files);
        res.send({
          data: resUpload
        });
      } catch (err) {
        console.error(`Error uploading files:`, err.message);
        next(err);
      }
    }
  });
});

// remove files from storage
router.put('/upload/:folder', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        const resUpload = await UploadAPI.remove(req.params.folder, req.body);
        res.send({
          data: resUpload
        });
      } catch (err) {
        console.error(`Error removing files:`, err.message);
        next(err);
      }
    }
  });
});

// remove files from storage
router.put('/upload/:folder/:subfolder', helper.verifyToken, async function(req, res, next) {
  jwt.verify(req.token, new Buffer.from(process.env.SECRET_KEY, 'base64'), async(err, data) => {
    if(err) {
      res.sendStatus(401);
    } else {
      try {
        const resUpload = await UploadAPI.removeFromSubfolder(req.params.folder, req.params.subfolder, req.body);
        res.send({
          data: resUpload
        });
      } catch (err) {
        console.error(`Error removing files:`, err.message);
        next(err);
      }
    }
  });
});
module.exports = router;
require("dotenv").config();
const fs = require('fs');
const AWS = require('aws-sdk');
const multiparty=require('multiparty');

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

// TOKEN FORMAT : Bearer <access_token>
function verifyToken(req, res, next) {
  // GET auth header value
  const bearerHeader = req.headers['authorization'];
  if(bearerHeader) {
    // retrieving the token
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
// initialize s3 interface
AWS.config.update({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: "eu-central-1"
});

const uploadFileToS3 = (formData, folder) => {
  
  let form = new multiparty.Form();
  form.parse(formData, async function(err, fields, files) {
    const file = files.files[0];

    const s3 = new AWS.S3();
    console.log(file);

    // Read content from the file
    const fileContent = fs.readFileSync(file.path);

    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${folder}/${file.originalFilename}`, // File name you want to save as in S3
      Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
      if (err) {
        return false;
      }
      
      const remotePath = `https://${BUCKET_NAME}.s3.amazonaws.com/${folder}/${file.originalFilename}`;

      return {
        remotePath
      };

    });
  });
};

const getFileFromS3 = (filePath) => {
  const s3 = new AWS.S3();
  const getFolderParams = {
    Bucket: BUCKET_NAME,
    Prefix: filePath
  };

  s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: filePath }, function(err, data) {
    if (err){
      console.log({success:false,err:err});
      return {success:false,err:err};
    }

    console.log({success:true,data:data});
    console.log(data.Contents);
    return data.Location;
  });
};

module.exports = {
  getOffset,
  emptyOrRows, 
  verifyToken,
  uploadFileToS3,
  getFileFromS3
}
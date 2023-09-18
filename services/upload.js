const moment = require('moment');
const admin = require('firebase-admin');
const bucket = admin.storage().bucket();
require("dotenv").config();

async function upload(folder, files){
  // UPLOAD NEW FILES
  try {
    const filesData = Object.values(files);

    const result = await Promise.all(filesData.map(async (file, index) => {
      bucket.file(`${folder}/${file.name}`).createWriteStream().end(file.data);

      const downUrl =  await bucket.file(`${folder}/${file.name}`)
      .getSignedUrl({action: 'read', expires: `01-01-${new Date().getFullYear() + 10}`})
      .then((url) => url[0]);
      
      return {
        url: downUrl,
        name: file.name,
        size: file.size,
        lastUpdated: moment(new Date()).format('YYYY-MM-DD HH:mm'),
      };
    }));

    return result;
  } catch(err) {
    return err;
  }
}

async function uploadtoSubfolder(folder, subfolder, files){
  // UPLOAD NEW FILES
  try {
    const filesData = Object.values(files);

    const result = await Promise.all(filesData.map(async (file, index) => {
      bucket.file(`${folder}/${subfolder}/${file.name}`).createWriteStream().end(file.data);

      const downUrl =  await bucket.file(`${folder}/${file.name}`)
      .getSignedUrl({action: 'read', expires: `01-01-${new Date().getFullYear() + 10}`})
      .then((url) => url[0]);
      
      console.log(file);
      return {
        url: downUrl,
        name: file.name,
        size: file.size,
        lastUpdated: moment(new Date()).format('YYYY-MM-DD HH:mm'),
      };
    }));

    return result;
  } catch(err) {
    return err;
  }
}

async function remove(folder, files) {
  files.map((a) => {
    bucket.file(`${folder}/${a.name}`).delete().then(function(data) {
      return data[0];
    });
    console.log(`File ${folder}/${a.name} deleted`);
    return 'File deleted';
  });
  
  return true;
}

async function removeFromSubfolder(folder, subfolder, files) {
  files.map((a) => {
    bucket.file(`${folder}/${subfolder}/${a.name}`).delete().then(function(data) {
      return data[0];
    });
    console.log(`File ${folder}/${subfolder}/${a.name} deleted`);
    return 'File deleted';
  });
  
  return true;
}

// async function download(query){
  // const path = `${query.folder}${query.subfolder ? `/${query.subfolder}`: ''}/${query.filePath}`;
  // const res = `https://storage.googleapis.com/esa-project-66e01.appspot.com/${path}`;
  // You have to wait till the file is downloaded
  // const res = await bucket.file(path).download({destination: `${process.env.ROOT_PATH}/uploads/${query.filePath}`});
  

  // return `${process.env.ROOT_PATH}/uploads/${query.filePath}`;
//   return res;
// }

module.exports = {
  upload, uploadtoSubfolder, remove, removeFromSubfolder
}
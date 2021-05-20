const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');

let mongourl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

// create storage engine
const storage = new GridFsStorage({
  url: mongourl,

  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = Date.now() + path.extname(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads',
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({
  storage,
});

module.exports = upload;

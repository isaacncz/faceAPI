var express = require('express');
var router = express.Router();

var imageController = require('../controllers/imageController');
const upload = require('../middleware/upload');

router.get('/getAll', imageController.findUpload);

router.get('/get/recent', imageController.recent);

router.get('/get/files', imageController.allFiles);

router.get('/get/file/id/:filename', imageController.fileByFilename);

router.get('/get/image/id/:filename', imageController.imageByFilename);

router.post('/upload/one', upload.single('file'), imageController.uploadSingle);

router.post(
  '/upload/multiple',
  upload.array('file', 5),
  imageController.uploadMultiple
);

router.delete('/delete/file/id/:id', imageController.deleteFile);

router.delete('/delete/image/id/:id', imageController.deleteID);

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('upload', { title: 'BLOB Upload' });
});

module.exports = router;

var multer = require('multer');
var upload = multer({ dest: './public/images' }).single('thumbnail');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const storage = require('azure-storage');
const blobService = storage.createBlobService();
const containerName = 'srablobtest';

router.post('/', function (req, res) {

  upload(req, res, function (err) {
    if (err) {
      res.send("Failed to write " + req.file.destination + " with " + err);
    } else {
      blobService.createBlockBlobFromLocalFile(containerName, req.file.filename, req.file.path, function (error) {
        res.send('<a href="/">TOP</a>' + "<p></p>uploaded " + req.file.originalname + "<p></p>mimetype: " +
          req.file.mimetype + "<p></p>Size: " + req.file.size);
        if (error) {
          console.log(error);
        } else {
          console.log(' Blob ' + req.file.originalname + ' upload finished.');
        }
      }
      );
    }
  });
});
var express = require('express');
var router = express.Router();
var items = [];

/* GET home page. */
router.get('/', function (req, res, next) {
  downloadBlobs(containerName, './public/images', function () {
    res.render('download', { title: 'BLOB List', items });
  });
});

module.exports = router;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const storage = require('azure-storage');
const blobService = storage.createBlobService();
const containerName = 'srablobtest';

var fs = require('fs');

function downloadBlobs(containerName, destinationDirectoryPath, callback) {
  console.log('Entering downloadBlobs.');

  // Validate directory
  if (!fs.existsSync(destinationDirectoryPath)) {
    console.log(destinationDirectoryPath + ' does not exist. Attempting to create this directory...');
    fs.mkdirSync(destinationDirectoryPath);
    console.log(destinationDirectoryPath + ' created.');
  }

  // NOTE: does not handle pagination.
  blobService.listBlobsSegmented(containerName, null, function (error, result) {
    if (error) {
      console.log(error);
    } else {
      //Todo コンテナ内のBLOBのリストを取得　ここを操作すれば、取得可能？
      var blobs = result.entries;
      var blobsDownloaded = 0;

      var i = 20;
      if (blobs.length < i) {

        var downloadTest = blobs.slice(0, blobs.length);
        console.log(downloadTest);

      } else {

        var downloadTest = blobs.slice(0, i);
        console.log(downloadTest);

      }

      downloadTest.forEach(function (blob) {
        items.push(blob.name);
        blobService.getBlobToLocalFile(containerName, blob.name, destinationDirectoryPath + '/' + blob.name, function (error2) {
          blobsDownloaded++;

          if (error2) {
            console.log(error2);
          } else {
            console.log(' Blob ' + blob.name + ' download finished.');

            if (blobsDownloaded === blobs.length) {
              // Wait until all workers complete and the blobs are downloaded
              console.log('All files downloaded');
              callback();
            } else if (blobsDownloaded === i) {
              // Wait until all workers complete and the blobs are downloaded
              console.log('All files downloaded');
              callback();
            }
          }
        });
      });
    }
  });
}
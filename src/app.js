var crypto = require('crypto');
var recursive = require('recursive-readdir');
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');

var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';

// let sourceDirectory = 'D:/Temp/source';
// let destinationDirectory = 'D:/Temp/destination';

// recursive(sourceDirectory, function (err, files) {
//   for (var i = 0; i < files.length; i ++) {
//       let relativePath = path.relative(sourceDirectory, files[i]);
//       encryptFile(files[i], path.join(destinationDirectory, relativePath));
//   }
// });

let sourceDirectory = 'D:/Temp/destination';
let destinationDirectory = 'D:/Temp/abc';

recursive(sourceDirectory, function (err, files) {
  for (var i = 0; i < files.length; i ++) {
      let relativePath = path.relative(sourceDirectory, files[i]);
      decryptFile(files[i], path.join(destinationDirectory, relativePath));
  }
});


//encryptFile('C:/Users/Barend.Erasmus/Desktop/Capture.PNG', 'C:/Users/Barend.Erasmus/Desktop/Capture.PNG.enc');
//decryptFile('C:/Users/Barend.Erasmus/Desktop/Capture.PNG.enc', 'C:/Users/Barend.Erasmus/Desktop/out.PNG');

function encryptFile(sourceFilePath, destinationFilePath) {
    var inputStream = fs.createReadStream(sourceFilePath);
    var outputStream = fs.createWriteStream(destinationFilePath);

    var zip = zlib.createGzip();
    var unzip = zlib.createGunzip();

    var encrypt = crypto.createCipher(algorithm, password);
    var decrypt = crypto.createDecipher(algorithm, password)

    inputStream.pipe(zip).pipe(encrypt).pipe(outputStream);
}
function decryptFile(sourceFilePath, destinationFilePath) {
    var inputStream = fs.createReadStream(sourceFilePath);
    var outputStream = fs.createWriteStream(destinationFilePath);

    var zip = zlib.createGzip();
    var unzip = zlib.createGunzip();

    var encrypt = crypto.createCipher(algorithm, password);
    var decrypt = crypto.createDecipher(algorithm, password)

    inputStream.pipe(decrypt).pipe(unzip).pipe(outputStream);
}
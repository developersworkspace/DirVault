var crypto = require('crypto');
var recursive = require('recursive-readdir');
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');

var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';

let sourceDirectory = 'F:/Temp/Source';
let destinationDirectory = 'F:/Temp/Destination';

recursive(sourceDirectory, function (err, files) {
    for (var i = 0; i < files.length; i++) {
        let relativePath = path.relative(sourceDirectory, files[i]);
        let directoryRelativePath = path.dirname(relativePath);

        createDirectory(path.join(destinationDirectory, directoryRelativePath));
        encryptFile(files[i], path.join(destinationDirectory, relativePath));

        fs.unlinkSync(files[i]);
    }
});

// let sourceDirectory = 'F:/Temp/Destination';
// let destinationDirectory = 'F:/Temp/Source';

// recursive(sourceDirectory, function (err, files) {
//     for (var i = 0; i < files.length; i++) {
//         let relativePath = path.relative(sourceDirectory, files[i]);
//         let directoryRelativePath = path.dirname(relativePath);

//         createDirectory(path.join(destinationDirectory, directoryRelativePath));
//         decryptFile(files[i], path.join(destinationDirectory, relativePath));

//         fs.unlinkSync(files[i]);
//     }
// });


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

function createDirectory(dirpath) {
    var parts = dirpath.split(path.sep);
    for (var i = 1; i <= parts.length; i++) {
        mkdirSync(path.join.apply(null, parts.slice(0, i)));
    }
}

function mkdirSync(path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}
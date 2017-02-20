var crypto = require('crypto');
var recursive = require('recursive-readdir');
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var program = require('commander');

program
    .arguments('<source> <destination>')
    .option('-p, --password <password>', 'AES password')
    .option('-e, --encrypt', 'Encrypt')
    .option('-d, --decrypt', 'Decrypt')
    .option('-c, --clean', 'Deletes source files after encrypt/decrypt')
    .action(function (sourceDirectory, destinationDirectory) {
        if (program.encrypt == true) {
            encryptDirectory(sourceDirectory, destinationDirectory, program.password, program.clean);
        } else if (program.decrypt == true) {
            decryptDirectory(sourceDirectory, destinationDirectory, program.password, program.clean);
        }else {
            console.log('missing encrypt/decrypt option. See help for more info. \r\n\r\n \'dir-vault --help\' ');
        }
    })
    .parse(process.argv);


function encryptDirectory(sourceDirectory, destinationDirectory, password, clean) {

    recursive(sourceDirectory, function (err, files) {
        for (let i = 0; i < files.length; i++) {
            let relativePath = path.relative(sourceDirectory, files[i]);
            let directoryRelativePath = path.dirname(relativePath);

            createDirectory(path.join(destinationDirectory, directoryRelativePath));
            encryptFile(files[i], path.join(destinationDirectory, relativePath), password);

            if (clean == true) {
                fs.unlinkSync(files[i]);
            }
        }
    });
}

function decryptDirectory(sourceDirectory, destinationDirectory, password, clean) {

    recursive(sourceDirectory, function (err, files) {
        for (let i = 0; i < files.length; i++) {
            let relativePath = path.relative(sourceDirectory, files[i]);
            let directoryRelativePath = path.dirname(relativePath);

            createDirectory(path.join(destinationDirectory, directoryRelativePath));
            decryptFile(files[i], path.join(destinationDirectory, relativePath), password);

            if (clean == true) {
                fs.unlinkSync(files[i]);
            }
        }
    });
}



function encryptFile(sourceFilePath, destinationFilePath, password) {

    let algorithm = 'aes-256-ctr';

    let inputStream = fs.createReadStream(sourceFilePath);
    let outputStream = fs.createWriteStream(destinationFilePath);

    let zip = zlib.createGzip();
    let unzip = zlib.createGunzip();

    let encrypt = crypto.createCipher(algorithm, password);
    let decrypt = crypto.createDecipher(algorithm, password)

    inputStream.pipe(zip).pipe(encrypt).pipe(outputStream);
}

function decryptFile(sourceFilePath, destinationFilePath, password) {

    let algorithm = 'aes-256-ctr';

    let inputStream = fs.createReadStream(sourceFilePath);
    let outputStream = fs.createWriteStream(destinationFilePath);

    let zip = zlib.createGzip();
    let unzip = zlib.createGunzip();

    let encrypt = crypto.createCipher(algorithm, password);
    let decrypt = crypto.createDecipher(algorithm, password)

    inputStream.pipe(decrypt).pipe(unzip).pipe(outputStream);
}

function createDirectory(dirpath) {
    let parts = dirpath.split(path.sep);
    for (let i = 1; i <= parts.length; i++) {
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
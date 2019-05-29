const functions = require('firebase-functions');

const path = require('path');
const os = require('os');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.onFileChange = functions.storage.object().onFinalize(event => {

    const bucket = event.bucket;
    const contentType = event.contentType;
    const fileName = event.name;

    console.log('File Change Detected');

    if(path.basename(fileName).startsWith('renamed-')) {
        console.log('We already renamed the file!');
        return;
    }

    const destBucket = admin.storage().bucket(bucket);
    const tempFilePath = path.join(os.tmpdir() + path.basename(fileName));
    const metaData = {
        contentType
    };

    return destBucket.file(fileName).download({
        destination: tempFilePath
    }).then(() => {
        return destBucket.upload(tempFilePath, {
            destination: 'renamed-' + path.basename(fileName),
            metaData: metaData
        })
    })
})
const fs = require('fs');

exports.deleteFile = (filePath) => {
    fs.unlink('public' + filePath, err => {
        if(err) {
            console.log(err, 123456)
        }
    })
}
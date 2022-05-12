const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink('public/' + filePath, err => {
        if(err) {
            console.log(err, 123456)
        }
    })
} 

exports.deleteFile = deleteFile
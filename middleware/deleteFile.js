const fs = require('fs');

// exports.deleteFile = (filePath) => {
//     fs.unlink(filePath, err => { // del file of passed path
//         err ? next(err) : null
//     })
// } //Error: TypeError: deleteFile is not a function

const deleteFile = (filePath) => {
    fs.unlink(filePath, err => {
        if(err) throw err
    })
} 

exports.deleteFile = deleteFile
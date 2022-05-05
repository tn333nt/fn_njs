const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink('public' + filePath, err => {
        if(err) {
            console.log(err, 123456)
        }
    })
} 

exports.deleteFile = deleteFile

/*
[Error: ENOENT: no such file or directory, unlink 'E:\images\2022-05-05T06-22-46.922Z-Screenshot 2022-05-04 204452.png'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'unlink',
  path: 'E:\\images\\2022-05-05T06-22-46.922Z-Screenshot 2022-05-04 204452.png'
} 123456
*/
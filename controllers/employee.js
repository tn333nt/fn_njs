
const User = require('../models/user');
const deleteFile = require('../middleware/deleteFile')


// up , store & serve file
exports.postProfile = (req, res, next) => {
    const userId = req.user._id
    const image = req.file;

    if (!image) {
        return res.status(422).render('employee/profile', {
            title: 'profile',
            path: '/profile',
            errMsg: 'check the file'
        });
    }

    User.findById(userId)
        .then(user => {
            if (image) {
                deleteFile(user.image)
                user.image = 'images/' + image.filename
            }
            return user.save();
        })
        .then(() => res.redirect('/profile'))
        .catch(err => next(err))
};

exports.getProfile = (req, res, next) => {
    const userId = req.user._id
    User.findById(userId)
    .then(user => {
        res.render('employee/profile', {
            title: 'profile',
            path: '/profile',
            user: user,
            errMsg: null
        });
    })
    .catch(err => next(err))
};


// post health info & extract it into file
exports.postHealthDeclaration = (req, res, next) => {
    const userId = req.user._id;
    const temperature = req.body.temperature;
    const timeRegister = req.body.timeRegister;
    const injectionType1 = req.body.injectionType1;
    const injectionDate1 = req.body.injectionDate1;
    const injectionType2 = req.body.injectionType2;
    const injectionDate2 = req.body.injectionDate2;
    const isPositive = req.body.isPositive;
    // validate later

    User.findById(userId)
        .then(user => {
            user.health = {
                timeRegister: timeRegister,
                temperature: temperature,
                vaccination: {
                    turn1: {
                        type: injectionType1,
                        date: injectionDate1
                    },
                    turn2: {
                        type: injectionType2,
                        date: injectionDate2
                    }
                },
                isPositive: isPositive
            }
            return user.save()
        })
        .then(() => res.redirect('/health-declaration'))
        .catch(err => next(err))
};

import mongoose from 'mongoose';
import TheUser from './model.mjs';
let Admin={};
// if(!mongoose.model('Admin')){
//     Admin=TheUser()
// }
// console.log('mongoose.modelNames()', mongoose.modelNames())
import global from '#root/global';
var self = ( {
    all: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Admin.find(function (err, users) {

            if (err || !users) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            Admin.countDocuments({}, function (err, count) {
                console.log('countDocuments', count);
                if (err || !count) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                res.json(users);
                return 0;


            });

        }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },
    viewOne: function (req, res, next) {

        Admin.findById(req.params.id,
            function (err, user) {
                if (err || !user) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json(user);
                return 0;

            });
    },
    create: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            Admin.create(req.body, function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });

    },
    destroy: function (req, res, next) {
        Admin.findByIdAndDelete(req.params.id,
            function (err, user) {
                if (err || !user) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json({
                    success: true,
                    message: 'Deleted!'
                });
                return 0;


            }
        );

    },
    edit: function (req, res, next) {
        Admin.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
            if (err || !user) {
                res.json({
                    success: false,
                    message: 'error!',
                    err:err
                });
                return 0;
            }

            res.json(user);
            return 0;


        });
    },
    count: function (req, res, next) {
        Admin.countDocuments({}, function (err, count) {
            console.log('countDocuments', count);
            if (err) {
                res.json({
                    success: false,
                    err: err
                })

            }
            res.json({
                success: true,
                count: count
            })


        });
    },
    login: function (req, res, next) {
        if (req.body.identifier && req.body.password) {
            let Admin=mongoose.model('Admin');
            Admin.authenticate(req.body.identifier, req.body.password, function (error, user) {
                if (error || !user) {
                    let err = new Error('Wrong email or password.');
                    err.status = 401;
                    res.status(401);
                    return res.json({'success': false, 'message': 'نام کاربری یا رمز عبور اشتباه!'});
                } else {
                    // req.session.userId = user._id;
                    return res.json({'success': true, 'message': 'در حال ریدایرکت...', 'user': user});
                }
            });
        } else {
            let err = new Error('All fields required.');
            err.status = 400;
            return res.json({'success': false, 'message': 'لطفا تمامی فیلد ها را تکمیل کنید!'});
        }
    },
    register: function (req, res, next) {
        if (req.body.email &&
            req.body.username &&
            req.body.password) {
            let Admin=mongoose.model('Admin');

            let userData = req.body;
            userData.type = 'user';
            userData.token = global.generateUnid();


            Admin.create(userData, function (error, user) {
                if (error) {

                    return res.json({err: error});
                } else {
                    return res.json({'success': true, 'message': 'ساخته شد'});

                }
            });

        }
    },
});
export default self;
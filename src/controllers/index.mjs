import mongoose from "mongoose";

var self = (Model) => {
    // console.log('Model', Model)
    return ({
        all: function (req, res, next) {
            console.log('==> all()', Model);
            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }
            let fields = '';
            if (req.headers && req.headers.fields) {
                fields = req.headers.fields
            }
            Model.find({}, fields,
                function (err, model) {
                // console.log('req',req.method)
                    if(req.headers.response!=="json"){
                        return res.show()

                    }
                    if (err || !model)
                        return res.json([]);
                    return res.json(model);
                }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        },

        viewOne: function (req, res, next) {
            console.log('viewOne...', req.params.id);
            let obj = {};
            if (mongoose.isValidObjectId(req.params.id)) {
                obj["_id"] = req.params.id;
            } else {
                obj["slug"] = req.params.id;

            }
            Model.findOne(obj,
                function (err, menu) {
                    if (err || !menu) {
                        res.json({
                            success: false,
                            message: 'error!'
                        });
                        return 0;
                    }
                    res.json(menu);
                    return 0;

                });
        }
        ,

        create: function (req, res, next) {
            Model.create(req.body, function (err, menu) {
                if (err || !menu) {
                    res.json({
                        err: err,
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json(menu);
                return 0;

            });
        }
        ,
        destroy: function (req, res, next) {
            Model.findByIdAndDelete(req.params.id,
                function (err, menu) {
                    if (err || !menu) {
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
        }
        ,
        edit: function (req, res, next) {
            Model.findByIdAndUpdate(req.params.id, req.body, function (err, menu) {
                if (err || !menu) {
                    res.json({
                        success: false,
                        message: 'error!',
                        err: err
                    });
                    return 0;
                }

                res.json(menu);
                return 0;

            });
        }
        ,
        count: function (req, res, next) {
            Model.countDocuments({}, function (err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }

                res.json({
                    success: true,
                    count: count
                });
                return 0;


            });
        }
        ,


    })
};
export default self;

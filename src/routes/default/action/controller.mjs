var self = ( {
    all: function (req, res, next) {
        let Action = req.mongoose.model('Action');

        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.query.user) {

            search['user']=req.query.user;

        }
        if (req.query.product) {

            search['product']=req.query.product;

        }
        Action.find(search,'user , customer , _id , title , createdAt', function (err, actions) {

            if (err || !actions) {
                res.json({
                    success: false,
                    message: 'error!',
                    actions: actions
                });
                return 0;
            }
            Action.countDocuments({}, function (err, count) {
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
                return res.json(actions);


            });

        }).populate('customer','phoneNumber firstName lastName _id').populate('product','title _id').populate('user','username _id nickname').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },
});
export default self;
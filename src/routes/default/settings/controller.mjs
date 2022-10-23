
var self = ( {
    last: function(req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function(err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss[0] && settingss[0].data)
                res.json(settingss[0].data);
            else
                res.json([]);
            return 0;


        }).skip(offset).sort({ _id: -1 }).limit(1);
        // res.json([]);
    },

});
export default self;
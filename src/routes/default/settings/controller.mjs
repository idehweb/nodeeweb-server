import shell from 'shelljs';
import path from "path";
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
    restart: function(req, res, next){
        const _dirname = path.resolve();
        let site = process.env.SITE_NAME;
        site = site.toLowerCase();
        console.log("Site ==> ", site);
        // console.log("dirname ===> " ,_dirname);
        const scripts = path.join(_dirname, "node_modules/@nodeeweb/server/scripts");
        console.log("scripts ==> ", 'sh '+scripts+`/restart.sh ${site}`);
        res.json({
            success:true
        })
        shell.exec('sh '+scripts+`/restart.sh ${site}`);

    },

});
export default self;
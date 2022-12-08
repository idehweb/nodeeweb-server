import shell from 'shelljs';
import path from "path";
import fs from "fs";
import _ from "lodash";

var self = ({
    plugins: function (req, res, next) {
        let __dirname = path.resolve();
        let pluginPath = path.join(__dirname, "./plugins/");
        const getDirectories = (source, callback) =>
            fs.readdir(source, {withFileTypes: true}, (err, files) => {
                if (err) {
                    callback(err)
                } else {
                    callback(
                        files
                            .filter(dirent => dirent.isDirectory())
                    )
                }
            })
        getDirectories(pluginPath, function (f) {
            let p = _.map(f, (item) => {
                item.path = '/' + item.name + '/index.js'
                item.image = '/' + item.name + '/image.jpg'
                item.active = '/' + item.name + '/image.jpg'
            })
            return res.json(f);
        });


    },
    configuration: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        Settings.findOneAndUpdate({}, req.body, {new: true}, function (err, setting) {


            if (err && !setting) {


                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });

            }
            // self.updateImportantFiles(res,setting);
            // self.updateCssFile(res,setting);


            // file.pipe(fstream);
            // fstream.on("close", function() {
            //
            // });
            res.json({success: true, setting})

        });

    },
    last: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function (err, settingss) {
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


        }).skip(offset).sort({_id: -1}).limit(1);
        // res.json([]);
    },
    restart: function (req, res, next) {
        const _dirname = path.resolve();
        let site = process.env.SITE_NAME;
        site = site.toLowerCase();
        console.log("Site ==> ", site);
        // console.log("dirname ===> " ,_dirname);
        const scripts = path.join(_dirname, "node_modules/@nodeeweb/server/scripts");
        console.log("scripts ==> ", 'sh ' + scripts + `/restart.sh ${site}`);
        res.json({
            success: true
        })
        shell.exec('sh ' + scripts + `/restart.sh ${site}`);

    },

});
export default self;
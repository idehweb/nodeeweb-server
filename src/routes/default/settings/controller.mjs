import shell from 'shelljs';
import path from "path";
import fs from "fs";
import _ from "lodash";

var self = ({
    functions: function (req, res, next) {
        let functions = req.functions() || [];
        return res.json(functions);
    },
    events: function (req, res, next) {
        let events = req.events() || [];
        return res.json(events);
    },
    deactivatePlugin: function (req, res, next) {
        console.log('deactivatePlugin')
        let plugin = req.body;
        if (plugin && plugin.path && plugin.name) {
            let __dirname = path.resolve();
            let pluginPath = path.join(__dirname, "./plugins", plugin.name);
            let newPluginPath = path.join(__dirname, "./plugins", plugin.name + '-deactive');
            const scripts = path.join(__dirname, "node_modules/@nodeeweb/server/scripts");

            shell.exec('sh ' + scripts + `/mv.sh ${pluginPath} ${newPluginPath}`);
            // console.log('newPluginPath', newPluginPath)
            return res.json({
                success: true,
            })
        } else {
            return res.json({
                success: false
            })
        }
    },
    activatePlugin: function (req, res, next) {
        console.log('activatePlugin')
        let plugin = req.body;
        if (plugin && plugin.path && plugin.name) {
            let __dirname = path.resolve();
            let pluginPath = path.join(__dirname, "./plugins", plugin.name);
            let newPluginPath = path.join(__dirname, "./plugins", plugin.name.replace('-deactive', ''));
            const scripts = path.join(__dirname, "node_modules/@nodeeweb/server/scripts");

            shell.exec('sh ' + scripts + `/mv.sh ${pluginPath} ${newPluginPath}`);
            // console.log('newPluginPath', newPluginPath)
            return res.json({
                success: true,
            })
        } else {
            return res.json({
                success: false
            })
        }
    },
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
                            .filter(dirent => {
                                return (dirent.isDirectory() && (dirent.name.indexOf('deactive') == -1))
                            })
                    )
                }
            })
        getDirectories(pluginPath, function (f) {
            let p = _.map(f, (item) => {
                item.path = '/' + item.name + '/index.js'
                item.image = '/' + item.name + '/image.jpg'
            })
            return res.json(f);
        });


    },
    market: function (req, res, next) {


    },
    updatePluginRules: function (req, res, next) {
        let pluginName = req.params.plugin;
        let Settings = req.mongoose.model('Settings');

        Settings.findOne({}, 'plugins', function (err, setting) {
            if (!setting.plugins) {
                setting.plugins = {};
            }
            setting.plugins[pluginName] = req.body;
            console.log('setting.plugins', setting.plugins)
            Settings.findOneAndUpdate({}, {$set: {plugins: setting.plugins}}, {
                projection: {
                    plugins: 1
                },
            }, function (err, setting) {
                if (err && !setting) {
                    res.json({
                        err: err,
                        success: false,
                        message: "error"
                    });
                }
                res.json({success: true, setting})

            });
        });
    },
    pluginRules: function (req, res, next) {
        // let Settings = req.mongoose.model('Settings');
        if (req.props['plugin'] && req.props['plugin'][req.params.plugin]) {

            let Settings = req.mongoose.model('Settings');

            Settings.findOne({}, 'plugins', function (err, setting) {
                if (!setting.plugins) {
                    setting.plugins = [];
                }


                // console.log('setting.plugins[req.params.plugin]', setting.plugins[req.params.plugin])
console.log('req.props[\'plugin\']',req.props['plugin'])
                _.forEach(req.props['plugin'][req.params.plugin], (item, j) => {
                    if (setting.plugins[req.params.plugin]) {

                        req.props['plugin'][req.params.plugin][j].value = setting.plugins[req.params.plugin][item.name];
                    }
                })
                return res.json({fields: req.props['plugin'][req.params.plugin]})

            })
        } else
            return res.json({fields: []})
    },
    deActivePlugins: function (req, res, next) {
        let __dirname = path.resolve();
        let pluginPath = path.join(__dirname, "./plugins/");
        const getDirectories = (source, callback) =>
            fs.readdir(source, {withFileTypes: true}, (err, files) => {
                if (err) {
                    callback(err)
                } else {
                    callback(
                        files
                            .filter(dirent => {
                                return (dirent.isDirectory() && (dirent.name.indexOf('deactive') > -1))
                            })
                    )
                }
            })
        getDirectories(pluginPath, function (f) {
            let p = _.map(f, (item) => {
                item.path = '/' + item.name + '/index.js'
                item.image = '/' + item.name + '/image.jpg'
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
    customerStatus: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'customerStatus', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss.customerStatus)
                res.json(settingss.customerStatus);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    formStatus: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("formStatus ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'formStatus', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss.formStatus)
                res.json(settingss.formStatus);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    factore: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'factore_shop_name factore_shop_site_name factore_shop_address factore_shop_phoneNumber factore_shop_faxNumber factore_shop_postalCode factore_shop_submitCode factore_shop_internationalCode', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss)
                res.json(settingss);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    restart: function (req, res, next) {
        const _dirname = path.resolve();
        let site = process.env.SITE_NAME || "";
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
    update: function (req, res, next) {
        const _dirname = path.resolve();
        let site = process.env.SITE_NAME;
        site = site.toLowerCase();
        console.log("Site ==> ", site);
        // console.log("dirname ===> " ,_dirname);
        const scripts = path.join(_dirname, "node_modules/@nodeeweb/server/scripts");
        console.log("scripts ==> ", 'sh ' + scripts + `/update.sh ${site}`);
        res.json({
            success: true
        })
        shell.exec('sh ' + scripts + `/update.sh ${site}`);
    },
    fileUpload: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');
        let Media = req.mongoose.model('Media');

        if (req.busboy) {
            req.pipe(req.busboy);

            req.busboy.on("file", function (
                fieldname,
                file,
                filename,
                encoding,
                mimetype
            ) {

                let fstream;
                // console.log("on file app filePath", fieldname, file, filename, encoding, mimetype);
                if (!(filename && filename.filename)) {
                    res.json({
                        success: false
                    });
                    return 0;
                }
                let exention = filename.filename.split(".");
                // if (filename.mimetype.toString().includes('image')) {
                //   // name+=".jpg"
                // }
                // if (filename.mimetype.toString().includes('video')) {
                //   // name+="mp4";
                // }
                let name = "logo." + exention[1];
                let __dirname = path.resolve();

                let filePath = path.join(__dirname, "./public_media/site_setting/", name);

                fstream = fs.createWriteStream(filePath);
                // console.log('on file app mimetype', typeof filename.mimeType);

                file.pipe(fstream);
                fstream.on("close", function () {
                    // console.log('Files saved');
                    let url = "site_setting/" + name;
                    let obj = [{name: name, url: url, type: mimetype}];
                    req.photo_all = obj;
                    let photos = obj;
                    if (photos && photos[0]) {
                        Media.create({
                            name: photos[0].name,
                            url: photos[0].url,
                            type: photos[0].type,
                            theKey: "logo"

                        }, function (err, media) {


                            if (err && !media) {


                                res.json({
                                    err: err,
                                    success: false,
                                    message: "error"
                                });

                            }
                            Settings.findOneAndUpdate({}, {
                                logo: photos[0].url
                            }, {new: true}, function (err, setting) {


                                if (err && !setting) {


                                    res.json({
                                        err: err,
                                        success: false,
                                        message: "error"
                                    });

                                }
                                // console.log('setting',setting);
                                // console.log('media',media);
                                res.json(setting);

                            });

                        });
                    } else {
                        res.json({
                            success: false,
                            message: "upload faild!"
                        });
                    }
                });
            });
        } else {
            next();
        }
    },


});
export default self;
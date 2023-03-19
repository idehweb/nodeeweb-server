// console.log("#f db.mjs", new Date());
// import global from '#root/global';

// import Wizard from '../../wizard.js';

// Wizard.updateImportantFiles(process.env,props);
//
// import settingsController from '#controllers/settings';
// import userController from '#controllers/user';
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import shell from 'shelljs';
import global from '#root/global';

// console.log('sdfg',path.join(path.resolve('.'), '.env.local'));


// console.log('process.env');

// mongoose.Promise = global.Promise;
// console.log('process.env2');
// console.log('process.env.RESET', process.env.RESET)
// console.log('process.env.SERVER_PORT', process.env.SERVER_PORT)
// console.log('process.env.mongodbConnectionUrl', process.env.mongodbConnectionUrl)
// if(!process.env.mongodbConnectionUrl)
//     process.exit(0);
let connection = process.env.mongodbConnectionUrl;
// console.log('process.env.BASE_URL',process.env.BASE_URL);
const __dirname = path.resolve();

let options = {
    useNewUrlParser: true,
    dbName: process.env.dbName
};
export default (props = {}, app) => {
    return new Promise(function (resolve, reject) {

        props.entity.map(async e => {
            // console.log('run db...', e.modelName, e.model);

            await mongoose.model(e.modelName, e.model(mongoose))
            // await
            // e.model(mongoose);
            // arr[e.name]=
        })
        // global.models=arr;
        // console.log('arr',arr);
        // models(arr);
        mongoose
            .connect(connection, options)
            .then(async () => {
                resolve()
                await console.log("==> db connection successful to", "'" + process.env.dbName + "'", new Date());
                createPublicMediaFolder()
                createAdminFolder()
                createThemeFolder(props)
                createPluginFolder()
                // let filePath = path.join(__dirname, thePath, file_name);
                // try {
                //     // fs.promises.ex
                //     // let tt=fs.readFile(filePath)
                //     console.log('reading file:',filePath)
                //     // fs.promises.open(filePath).then(e=>{
                //     //     console.log('tt',e)
                //     //
                //     // })
                //     fs.promises.writeFile(filePath, data, "utf8");
                //     console.log("\ndata is written successfully in the file\n" +
                //         "filePath: " + filePath + " " + file_name);
                // }
                // catch (err) {
                //     console.log("not able to write data in the file ", err);
                //     // return res.json({
                //     //   success: false,
                //     //   err: err
                //     // });
                // }


                if (process.env.RESET == 'true') {
                    //if database does not have any records
                    //create user...
                    //& create default settings...
                    let Admin = mongoose.model('Admin');

                    Admin.exists({}, function (err, admin) {
                        if (err || !admin) {
                            reject(err);
                        } else {
                            let req = {
                                body: {
                                    email: process.env.ADMIN_EMAIL,
                                    username: process.env.ADMIN_USERNAME,
                                    password: process.env.ADMIN_PASSWORD
                                }
                            };
                            if (req.body.email &&
                                req.body.username &&
                                req.body.password) {
                                let Admin = mongoose.model('Admin');

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
                        }
                    });
                    // userController.exists().then((e) => {
                    //     console.log('user exist...')
                    // }).catch(e => {
                    //     console.log('create user...')
                    //
                    //     //create user
                    //     let req = {
                    //         body: {
                    //             email: process.env.ADMIN_EMAIL,
                    //             username: process.env.ADMIN_USERNAME,
                    //             password: process.env.ADMIN_PASSWORD
                    //         }
                    //     };
                    //     userController.register(req);
                    // })
                    // settingsController.exists().then((e) => {
                    //     console.log('setting exist...')
                    //
                    // }).catch(e => {
                    //     //create setting
                    //     console.log('create setting...')
                    //     settingsController.create({
                    //         body: {
                    //             siteActive: true
                    //         }
                    //     })
                    // })
                }
                // else {
                //     console.log('no need to import database...')
                // }
            })
            .catch(err => {
                console.error(err, "db name:", process.env.dbName)
                return process.exit(0)
            });
    });
}
const updatePublicMediaConfig = function () {
    global.updateFile("./public_media/site_setting/", "config.js",
        "window.BASE_URL='" + process.env.BASE_URL + "';\n" +
        "window.ADMIN_URL='" + process.env.ADMIN_URL + "';\n" +
        "window.THEME_URL='" + process.env.BASE_URL + "/theme';\n" +
        "window.ADMIN_ROUTE='" + process.env.BASE_URL + "/admin" + "';\n" +
        "window.SHOP_URL='" + process.env.SHOP_URL + "';",__dirname)
}
const updateAdminConfig = function () {
    global.updateFile("./admin/site_setting/", "config.js",
        "window.BASE_URL='" + process.env.BASE_URL + "';\n" +
        "window.ADMIN_URL='" + process.env.ADMIN_URL + "';\n" +
        "window.THEME_URL='" + process.env.BASE_URL + "/theme';\n" +
        "window.ADMIN_ROUTE='" + process.env.BASE_URL + "/admin" + "';\n" +
        "window.SHOP_URL='" + process.env.SHOP_URL + "';",__dirname)
}
// const updateThemeConfig = function (props={}) {
//     global.theme('admin',{props},null).then((resp = {})=>{
//         global.updateFile("./theme/site_setting/", "config.js",
//             "window.BASE_URL='" + process.env.BASE_URL + "';\n" +
//             "window.ADMIN_URL='" + process.env.ADMIN_URL + "';\n" +
//             "window.THEME_URL='" + process.env.BASE_URL + "/theme';\n" +
//             "window.SHOP_URL='" + process.env.SHOP_URL + "';\n"+
//             "window.theme=" + JSON.stringify(resp) + ";"
//             ,__dirname)
//     }).catch(e=>{
//         global.updateFile("./theme/site_setting/", "config.js",
//             "window.BASE_URL='" + process.env.BASE_URL + "';\n" +
//             "window.ADMIN_URL='" + process.env.ADMIN_URL + "';\n" +
//             "window.THEME_URL='" + process.env.BASE_URL + "/theme';\n" +
//             "window.SHOP_URL='" + process.env.SHOP_URL + "';",__dirname)
//     })
//
// }
const createPluginFolder = function () {
    let pluginPath = path.join(__dirname, "./plugins/");
    if (fs.existsSync(pluginPath)) {

    } else {
        fs.mkdir(pluginPath, () => {
        });
    }

}
const createThemeFolder = function (props={}) {
    const appDirectory = fs.realpathSync(process.cwd());

    const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
//
    const adminLocalPath = resolveApp('./theme')
    const adminModulePath = resolveApp('./node_modules/@nodeeweb/server/theme')
    const scripts = resolveApp('./node_modules/@nodeeweb/server/scripts')
    // console.log('adminLocalPath:',adminLocalPath)
    // console.log('adminModulePath:',adminModulePath)
    // console.log("scripts ==> ", 'sh '+scripts+`/cp.sh ${adminModulePath} ${adminLocalPath}`);

    const child = shell.exec('sh ' + scripts + `/cp.sh ${adminModulePath} ${adminLocalPath} `, function (code, stdout, stderr) {
        // console.log('code: ', code);
        // console.log('stdout: ', stdout);
        // console.log('stderr: ', stderr);
        global.updateThemeConfig(props)

    });

}
const createAdminFolder = function () {
    const appDirectory = fs.realpathSync(process.cwd());

    const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
//
    const adminLocalPath = resolveApp('./admin')
    const adminModulePath = resolveApp('./node_modules/@nodeeweb/server/admin')
    const scripts = resolveApp('./node_modules/@nodeeweb/server/scripts')
    // console.log('adminLocalPath:',adminLocalPath)
    // console.log('adminModulePath:',adminModulePath)
    // console.log("scripts ==> ", 'sh '+scripts+`/cp.sh ${adminModulePath} ${adminLocalPath}`);

    const child = shell.exec('sh ' + scripts + `/cp.sh ${adminModulePath} ${adminLocalPath} `, function (code, stdout, stderr) {
        // console.log('code: ', code);
        // console.log('stdout: ', stdout);
        // console.log('stderr: ', stderr);
        updateAdminConfig()

    });

}
const createAdminFolder2 = function () {
    let public_mediaPath = path.join(__dirname, "./admin/");
    let public_media_customerPath = path.join(__dirname, "./admin/site_setting/");
    if (fs.existsSync(public_mediaPath)) {
        // console.log('public_mediaPath exist...')
        if (fs.existsSync(public_media_customerPath)) {
            // console.log('public_media_customerPath exist...')
            updateAdminConfig()
        }
        else {
            fs.mkdir(public_media_customerPath, () => {
                // console.log('we created public_media_customerPath')
                updateAdminConfig()
            });
            // Below code to create the folder, if its not there
            // fs.mkdir('<folder_name>', cb function);
        }
    } else {
        // console.log('we should create public_mediaPath')
        // console.log('we should create public_media_customerPath')
        // Below code to create the folder, if its not there
        fs.mkdir(public_mediaPath, () => {
            // console.log('we created public_mediaPath')
            fs.mkdir(public_media_customerPath, () => {
                // console.log('we created public_media_customerPath')
                updateAdminConfig()
            });
        });
    }
}
const createPublicMediaFolder = function () {
    let public_mediaPath = path.join(__dirname, "./public_media/");
    let public_media_customerPath = path.join(__dirname, "./public_media/customer/");
    if (fs.existsSync(public_mediaPath)) {
        // console.log('public_mediaPath exist...')
        updatePublicMediaConfig();
        if (fs.existsSync(public_media_customerPath)) {
            // console.log('public_media_customerPath exist...')
        }
        else {
            fs.mkdir(public_media_customerPath, () => {
                // console.log('we created public_media_customerPath')
            });
            // Below code to create the folder, if its not there
            // fs.mkdir('<folder_name>', cb function);
        }
    } else {
        // console.log('we should create public_mediaPath')
        // console.log('we should create public_media_customerPath')
        // Below code to create the folder, if its not there
        fs.mkdir(public_mediaPath, () => {
            // console.log('we created public_mediaPath')
            updatePublicMediaConfig();
            fs.mkdir(public_media_customerPath, () => {
                // console.log('we created public_media_customerPath')
            });
        });
    }
}


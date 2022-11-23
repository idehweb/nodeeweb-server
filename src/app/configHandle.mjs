// console.log("#f configHandle.mjs", new Date());

import cookieParser from "cookie-parser";
import logger from "morgan";
import busboy from "connect-busboy";
import path from "path";
import {createPublicRoute} from "#routes/index";

const __dirname = path.resolve();
// const viewsFolder = path.join(__dirname, "./src/views");
// const publicFolder = path.join(__dirname, "./public");


const assetsFolder = path.join(__dirname, "./src/client/assets/img");
const public_mediaFolder = path.join(__dirname, "./public_media");
const adminFolder = path.join(__dirname, "./admin");
const themeFolder = path.join(__dirname, "./theme");

// const adminFolder = path.join(__dirname, "./admin");

let configHandle = (express, app, props = {}) => {
    app.disable("x-powered-by");
    app.use(logger("dev"));

    // const adminFolder = path.join(__dirname, props.base, "./admin");
    // const themeFolder = path.join(__dirname, props.base, "./theme");

    app.use(express.json({limit: "50mb"}));
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());

    app.use(busboy());
    app.use(express.static(public_mediaFolder, {maxage: "1y"}));

    // if(props.front) {
    path.adminFolder = adminFolder;
    path.themeFolder = themeFolder;
    console.log("props.base: ", props.base)
    console.log("adminFolder: ", adminFolder)
    console.log("themeFolder: ", themeFolder)
    console.log("public_mediaFolder: ", public_mediaFolder)
    app.use('/site_setting',express.static(themeFolder+'/site_setting'));
    app.use('/static',express.static(themeFolder+'/static'));
    app.use('/admin',express.static(adminFolder));
    // }
    // // let R = createPublicRoute('/admin')
    // if(props.admin) {
    //
    //     let adminFolder  = path.join(__dirname, props.base, "./admin");
    //     path.adminFolder=adminFolder;
    //
    //     // console.log("adminFolder: ", adminFolder)
    //     app.use(express.static(adminFolder, {index: ['index.html']}));
    // }
    // app.set("view engine", "pug");
    // app.use(express.static(assetsFolder));
    // console.log("==> configHandle");
};
export default configHandle;
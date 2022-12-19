// console.log("#f configHandle.mjs", new Date());
import mongoose from "mongoose"

import cookieParser from "cookie-parser";
import logger from "morgan";
import busboy from "connect-busboy";
import path from "path";
import _ from "lodash";
import {createPublicRoute} from "#routes/index";
import expressSitemapXml from 'express-sitemap-xml';
import controller from "#controllers/index";

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

    app.use(expressSitemapXml(getUrls, process.env.BASE_URL))

    async function getUrls() {
        let g = [];
        for(var i=0;i<props.entity.length;i++){
            if (props.entity[i].sitemap) {
                let Model = mongoose.model(props.entity[i].modelName);
                await allAsXml(Model).then(async (d) => {
                    console.log('d is here', d.length);
                    g = [...g,...d];
                });
            }
        }


        // Model = mongoose.model('Page');
        //
        // await allAsXml(Model).then(async (d) => {
        //     console.log('d is here', d.length);
        //     g = [...g,...d];
        // });
        await console.log('x', g);
        return await g;

    }

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
    app.use('/site_setting', express.static(themeFolder + '/site_setting'));
    app.use('/static', express.static(themeFolder + '/static'));
    app.use('/admin', express.static(adminFolder));
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
const allAsXml= async function (Model) {
    console.log('allAsXml')
    let XTL = [{
        url: '/',
        lastMod: new Date(),
        changeFreq: 'hourly'
    }], offset = 0, search = {};
    return new Promise(async function (resolve, reject) {
        console.log('Promis')
        search['status'] = 'published';
        // console.log('Model', Model)
        Model.find({},'_id slug updatedAt', function (err, posts) {
            // console.log(err)
            // console.log(posts)
            if(err || !posts.length){
                console.log('return')
                return resolve(XTL)
            }
            console.log('length',posts.length,XTL.length)
            _.forEach(posts, (p) => {
                // console.log('p',p)

                XTL.push({
                    url: '/' + Model.modelName.toLowerCase()+
                    '/' + p._id + '/' + p.slug,
                    lastMod: p.updatedAt,
                    changeFreq: 'hourly'
                });
                console.log(posts.length + 1, '===', XTL.length )
                if (posts.length + 1 === XTL.length) {
                    console.log('xtl',XTL)
                    resolve(XTL);
                }
            });

        }).skip(offset).sort({_id: -1});
        // resolve(XTL)
    });
};
export default configHandle;
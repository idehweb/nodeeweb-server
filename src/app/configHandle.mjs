// console.log("#f configHandle.mjs", new Date());
import mongoose from "mongoose"

import cookieParser from "cookie-parser";
import logger from "morgan";
import busboy from "connect-busboy";
import path from "path";
import _ from "lodash";
import {createPublicRoute} from "#routes/index";
import expressSitemapXml from 'express-sitemap-xml';
import siteMapHandle from "#root/app/siteMapHandle";

const __dirname = path.resolve();
// const viewsFolder = path.join(__dirname, "./src/views");
// const publicFolder = path.join(__dirname, "./public");


const assetsFolder = path.join(__dirname, "./src/client/assets/img");
const public_mediaFolder = path.join(__dirname, "./public_media");
const adminFolder = path.join(__dirname, "./admin");
const themeFolder = path.join(__dirname, "./theme");

// const adminFolder = path.join(__dirname, "./admin");

let configHandle = async (express, app, props = {}) => {
    await app.disable("x-powered-by");
    await app.use(logger("dev"));
    await siteMapHandle(express, app, props);
    await app.use(expressSitemapXml(getUrls, process.env.BASE_URL))

    async function getUrls() {
        let g = [];
        for (var i = 0; i < props.entity.length; i++) {
            if (props.entity[i].sitemap) {
                let Model = mongoose.model(props.entity[i].modelName);
                await allAsXml(Model).then(async (d) => {
                    console.log('d is here', d.length);
                    g = [...g, ...d];
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
    // app.use('/', express.static(themeFolder));
    // app.use('/', express.static(themeFolder , {index:'/robots.txt'}));
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
export const allAsXml = async function (Model) {
    console.log('allAsXml')
    let XTL = [{
        url: '/',
        lastMod: new Date(),
        changefreq: 'hourly'
    }], offset = 0, search = {};
    return new Promise(async function (resolve, reject) {
        console.log('Promis')
        search['status'] = 'published';
        // console.log('Model', Model)
        Model.find({}, '_id slug updatedAt', function (err, posts) {
            // console.log(err)
            // console.log(posts)
            if (err || !posts.length) {
                console.log('return')
                return resolve(XTL)
            }
            console.log('length', posts.length, XTL.length)
            _.forEach(posts, (p) => {
                // console.log('p',p)
                let the_base = '/' + Model.modelName.toLowerCase();
                if ('page' == Model.modelName.toLowerCase()) {
                    the_base = ''
                }
                XTL.push({
                    url: the_base +
                    '/' + p.slug + '/',
                    lastMod: p.updatedAt,
                    id: p._id,
                    changefreq: 'hourly'
                });
                console.log(posts.length + 1, '===', XTL.length)
                if (posts.length + 1 === XTL.length) {
                    console.log('xtl', XTL.length)
                    resolve(XTL);
                }
            });

        }).skip(offset).sort({_id: -1});
        // resolve(XTL)
    });
};
export const allAsXmlRules = async function (Model, slug = null) {
    console.log('allAsXmlRules');
    let f = [], counter = 0;
    let XTL = [], offset = 0, search = {};
    return new Promise(async function (resolve, reject) {
        search['status'] = 'published';
        Model.find({}, '_id slug updatedAt thumbnail photos status', function (err, posts) {
            if (err || !posts.length) {
                // console.log('return')
                return resolve(XTL)
            }
            // console.log('length', posts.length, XTL.length)
            _.forEach(posts, (p) => {
                counter++;
                if (f.indexOf(p.slug) > -1) {
                    // console.log('found duplicate',f.indexOf(p.slug));
                    //founded
                } else {
                    // console.log('found duplicate? ',f.indexOf(p.slug));
                    f.push(p.slug);
                    let gy='/' + (slug ? slug : Model.modelName.toLowerCase())

                    if(slug=="page"){
                        gy="";
                    }
                    console.log('gy',gy,'slug',p.slug)
                    let tobj = {
                        id: p._id,
                        url: gy +
                        '/' + p.slug + '/',
                        lastMod: p.updatedAt,
                        changefreq: 'hourly'
                    };
                    if (p.photos && p.photos[0]) {
                        tobj['image:image'] = p.photos[0];
                    }
                    if (p.thumbnail) {
                        tobj['image:image'] = p.thumbnail;
                    }
                    XTL.push(tobj);
                    // console.log(posts.length, '===', XTL.length)
                    if (posts.length === counter) {
                        // console.log('xtl', counter)
                        resolve(XTL);
                    }
                }
            });

        }).skip(offset).sort({_id: -1});
    });
};

export default configHandle;
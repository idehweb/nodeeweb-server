// console.log('#f routes/index')
// import React from 'react';

import express from 'express';
import path from "path";
import axios from "axios";
// const publicFolder = path.join(__dirname, "./public");
// import _ from 'loadash';
// import menu from "#routes/menu";
import { StaticRouter } from "react-router-dom/server";

import controller from "#controllers/index";
// import post from "#routes/post";
// import settings from "#routes/settings";
import mongoose from "mongoose";
// import user from "#routes/default/user/index";
import global from '#root/global';
import fs from "fs";
import "ignore-styles";
import * as React from "react";
// import * as ReactDOMServer from "react-router-dom/server";
import * as ReactDOMServer from "react-dom/server";

import { Provider } from "react-redux";
// import { StaticRouter } from "react-router-dom/server";

const __dirname = path.resolve();

// import {persistor, store} from "#c/functions/store";
// export function createDefaultRoute(app) {
//     Object.keys(mongoose.models).forEach((model, is) => {
//         console.log('model', model);
//         // app.use('/'mode)
//
//
//     });
// };
export function returnDefaultModels() {
//     return user.model(mongoose)
}

var Models = [];

export function createRoute(modelName, routes, label) {
    let router = express.Router();
    // console.log('in createRoute...', label, modelName)
    let model = mongoose.model(modelName);
    Models[modelName] = model;
    let cont = controller(Models[modelName]);
    router = create_standard_route('', routes, router);
    router.get('/', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.all, ...returnThisRouteRules('/', 'get', routes)}));
    router.get('/count', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.all, ...returnThisRouteRules('/count', 'get', routes)}));
    router.get('/:offset/:limit', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.all, ...returnThisRouteRules('/:offset/:limit', 'get', routes)}));
    router.get('/:offset/:limit/:search', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.all, ...returnThisRouteRules('/:offset/:limit/:search', 'get', routes)}));
    router.get('/:id', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.viewOne, ...returnThisRouteRules('/:id', 'get', routes)}));
    router.post('/', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.create, ...returnThisRouteRules('/', 'post', routes)}));
    router.post('/import', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.importEntity, ...returnThisRouteRules('/import', 'post', routes)}));
    router.put('/:id', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.edit, ...returnThisRouteRules('/:id', 'put', routes)}));
    router.delete('/:id', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.destroy, ...returnThisRouteRules('/:id', 'delete', routes)}));

    return router


}

export function createPublicRoute(suf = '', routes) {
    // console.log('createPublicRoute ...');
    const router = express.Router();

    return create_standard_route(suf, routes, router)
    // return [router];
}

function returnThisRouteRules(path, method, routes) {
    let obj = {
        path: path,
        method: method,
    };
    routes.forEach((ro) => {
        if (ro.method == method && ro.path == path) {
            obj['access'] = ro.access;
            if (ro.controller) {
                obj['controller'] = ro.controller;
            }
        }
    });
    return obj;
}

function make_routes_safe(req, res, next, rou) {
    console.log('make_routes_safe:', rou);
    req.mongoose = mongoose;

    res.ssrParse = (req, res, next) => {


        // return res.json(req);
        return new Promise(function (resolve, reject) {
            fs.readFile(path.themeFolder + '/index.html', "utf8", (err, body) => {

                if (err) {
                    console.error(err);
                    return res.status(500).send("An error occurred");
                }
                let obj = {}
                // resolve();
                // body = body.replace('</head>', `<title>${obj.title}</title></head>`);
                // body = body.replace('</head>', `<meta name="description" content="${obj.metadescription}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_id" content="${obj._id}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_name" content="${obj.product_name}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_price" content="${obj.product_price}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`);
                // body = body.replace('</head>', `<meta name="product_image" content="${obj.product_image}" /></head>`);
                // body = body.replace('</head>', `<meta name="image" content="${obj.image}" /></head>`);
                // body = body.replace('</head>', `<meta name="availability" content="${obj.availability}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:image" content="${obj.image}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:image:secure_url" content="${obj.image}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:image:width" content="1200" /></head>`);
                // body = body.replace('</head>', `<meta name="og:image:height" content="675" /></head>`);
                // body = body.replace('</head>', `<meta name="og:locale" content="fa_IR" /></head>`);
                // body = body.replace('</head>', `<meta name="og:type" content="website" /></head>`);
                // body = body.replace('</head>', `<meta name="og:title" content="${obj.title}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:description" content="${obj.description}" /></head>`);
                // body = body.replace('</head>', `<meta name="og:url" content="." /></head>`);
                // body = body.replace('</head>', `<meta name="og:site_name" content="Arvandshop" /></head>`);
                // body = body.replace('</head>', `<meta name="og:site_name" content="Arvandshop" /></head>`);
                // if(req.route.path=='/product/:_id/:_slug'){
                //
                // }
                const renderedData = (<div></div>);
                return res.status(200).send(body);
                resolve(body);
            });
        });
    };
    res.show = () => {
        // console.log('adminFolder',path.themeFolder+'/index.html')
        console.log('show', path.themeFolder);
        // res.ssrParse(req,res,next);
        return res.sendFile(path.themeFolder + '/index.html')
    };
    res.admin = () => {
        console.log('admin',path.adminFolder)
        // console.log('adminFolder',path.adminFolder+'/index.html')
        return res.sendFile(path.adminFolder + '/index.html')
    };

    req.global = global;

    req.models = () => {
        var models = mongoose.modelNames()
        return models;
    };
    req.adminRules = () => {
        // var models = mongoose.modelNames()
        return models;
    };
    req.builderComponents = (rules) => {
        let components = [];
        req.props.entity.forEach((en) => {
            if (en.components) {
                en.components.forEach((com) => {
                    components.push(com);
                });
            }
        });
        return components;

    }
    req.httpRequest = axios;
    req.rules = (rules) => {
        req.props.entity.forEach((en) => {
            let model = req.mongoose.model(en.modelName),
                identifire = en.modelName.toLowerCase();
            let schema = [];
            Object.keys(model.schema.obj).forEach(y => {
                // console.log('model.schema.obj[y]',model.schema.obj[y]);
                schema.push({"name": y, "type": global.getTypeOfVariable(model.schema.obj[y])});
            })
            if (en.admin && typeof en.admin === 'object') {
                rules[identifire] = en.admin;
            } else {
                rules[identifire] = {}
            }
            if (!rules[identifire].create) {
                rules[identifire].create = {};
            }
            if (!rules[identifire].create.fields) {
                rules[identifire].create.fields = schema;
            }
            if (!rules[identifire].edit) {
                rules[identifire].edit = {};
            }
            if (!rules[identifire].edit.fields) {
                rules[identifire].edit.fields = rules[identifire].create.fields;
            }
            if (!rules[identifire].list) {
                rules[identifire].list = {};
            }
            if (!rules[identifire].list.header) {
                rules[identifire].list.header = [];
            }

        })

        return rules;
    };
    if (rou.access) {
        let accessList = rou.access.split(',');
        if (accessList.indexOf('customer_all') > -1) {
            return rou.controller(req, res, next)

        }
        let isPassed = false, the_id = null;
        console.log('we need check access...', accessList, req.headers.token);
        if (!req.headers.token) {
            console.log('we have no token...');
            if (req.headers.response !== "json") {
                return res.redirect('/admin/login')
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'You have to authorize'
                });
            }
        }
        let counter = 0;
        accessList.forEach((al, j) => {
            let the_role = al.split('_');

            the_role[0] = the_role[0].trim().toLowerCase();
            the_role[0] = the_role[0].charAt(0).toUpperCase() + the_role[0].slice(1)
            let theModel = mongoose.model(the_role[0]);
            let findObject = {"tokens.token": req.headers.token};
            // if (the_role[1]) {
            //     findObject['type'] = the_role[1];
            // }
            console.log('check ' + j + '...', the_role[0], findObject)
            if (!isPassed)
                theModel.findOne(
                    findObject,
                    function (err, obj) {
                        counter++;
                        console.log('obj', obj)
                        if (err || !obj) {
                            return res.json({
                                theModel: theModel,
                                findObject: findObject,
                                obj: obj,
                                err: err,
                                success: false
                            })
                        }
                        if (obj.type == the_role[1]) {
                            isPassed = true;
                            the_id = obj._id;

                        } else {
                            console.log('#' + j + ' is not...')
                        }
                        if (counter === accessList.length) {
                            if (isPassed && the_id) {
                                console.log('#' + j + ' is passed...', ' counter:', counter)
                                req.headers._id = the_id;
                                return rou.controller(req, res, next)
                            } else {
                                return res.json({
                                    success: false,
                                    message: "You do not have access!"
                                })
                            }
                        }
                    }
                );
        })
        // console.log('rou.access',rou.access);
    } else {
        console.log('return response...')
        return rou.controller(req, res, next)

    }
}

function create_standard_route(suf = '/', routes = [], router) {
    // console.log('create_standard_route suf:',suf)
    if (routes)
        routes.forEach((rou) => {

            if (rou.path && rou.controller) {

                if (rou.method === 'get') {

                    router.get(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, {...returnThisRouteRules(suf + rou.path, 'get', routes)}));
                }
                if (rou.method === 'post') {

                    router.post(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, {...returnThisRouteRules(suf + rou.path, 'post', routes)}));
                }
                if (rou.method === 'put') {
                    router.put(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, {...returnThisRouteRules(suf + rou.path, 'put', routes)}));
                }
                if (rou.method === 'delete') {
                    router.delete(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, {...returnThisRouteRules(suf + rou.path, 'delete', routes)}));
                }
            }
        })
    return router
}
function handle_ssr(suf = '/', routes = [], router) {


}
//
//         let ua = req.get("user-agent");
//         if (!req.headers.lan)
//             req.headers.lan = "fa";
//         console.log("==> () ssrParse");
//
//         if (isbot(ua)) {
//             console.log("it is bot, we need SSR...");
//
//             console.log("BOT => ", ua);
//             fs.readFile(path.resolve("./build/index.html"), "utf8", (err, data) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).send("An error occurred");
//                 }
//                 const context = {};
//                 let cccc = [];
//                 const dataRequirements =
//                     routes
//                         .filter(route => {
//                             return (matchPath(route, req.url));
//                         })
//                         .map(route => {
//                             if (req.params._firstCategory && req.params._id) {
//                                 route.server[0].params = req.params._id;
//                             }
//                             return route;
//                         })
//                         .filter(comp => {
//                             return comp.server;
//                         })
//                         .map(comp => {
//                             console.log("typeof comp.server", typeof comp.server);
//                             if (typeof comp.server === "object") {
//                                 comp.server.forEach(s => {
//                                     console.log("s.params", s.params);
//                                     cccc.push(store.dispatch(s.func(s.params)));
//                                 });
//                                 return cccc;
//                             } else {
//                                 cccc.push(store.dispatch(comp.server(comp.params)));
//                                 return store.dispatch(comp.server(comp.params));
//
//                             }
//                             // return store.dispatch(comp.server(comp.parameter))
//                         }); // dispatch data requirement
//                 console.log("dataRequirements", cccc);
//                 Promise.all(cccc).then(() => {
//                     const renderedData = ReactDOMServer.renderToString(<Provider store={store}>
//                         <StaticRouter context={context} location={req.url}>
//                 <AppSSR url={req.url}/></StaticRouter></Provider>);
//                     console.log("res.send ==============>");
//                     res.locals.renderedData = renderedData;
//                     res.locals.body = data.replace(
//                         "<div id=\"root\"></div>",
//                         `<div id="root">${renderedData}</div>`
//                     );
//       // const renderedData = ReactDOMServer.renderToString(<Provider store={store}>
//       //                   <StaticRouter context={context} location={req.url}>
//       //           <AppSSR url={req.url}/></StaticRouter></Provider>);
//       //               console.log("res.send ==============>");
//       //               res.locals.renderedData = renderedData;
//       //               res.locals.body = data.replace(
//       //                   "<div id=\"root\"></div>",
//       //                   `<div id="root">${renderedData}</div>`
//       //               );
//
//                     resolve();
//                 });
//             });
//         }
//         else {
//             console.log("no need to ssr...");
//             resolve();
//         }
//     });
// };
// export const handle_ssr_response = (req, res, next) => {
//
//     console.log("go through home...");
//     global.getSettings(['title','description','logo']).then(set => {
//         console.log("set.title",set.title);
//         let body = res.locals.body;
//         if (body) {
//             body = body.replace('</head>', `<title>${set.title}</title></head>`);
//             body = body.replace('</head>', `<meta name="description" content="${set.description}" /></head>`);
//             console.log(' send... ');
//             return res.status(200).send(body);
//         } else {
//             console.log('render...');
//             return res.status(200).render('index',{
//                 title:set.title || "",
//
//                 description: set.description || "",
//                 url: global.domain + "/",
//                 width: "512",
//                 height: "512",
//                 image: global.domain + "/"+set.logo || "",
//                 html: global.body || ""
//
//             });
//         }
//     })
// };

export default {};

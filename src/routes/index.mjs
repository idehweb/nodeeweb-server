// console.log('#f routes/index')

import express from 'express';
import path from "path";
import axios from "axios";
// const publicFolder = path.join(__dirname, "./public");
// import _ from 'loadash';
// import menu from "#routes/menu";
import controller from "#controllers/index";
// import post from "#routes/post";
// import settings from "#routes/settings";
import mongoose from "mongoose";
// import user from "#routes/default/user/index";
import global from '#root/global';

const __dirname = path.resolve();


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
    router.get('/:id', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.viewOne, ...returnThisRouteRules('/:id', 'get', routes)}));
    router.post('/', (req, res, next) => make_routes_safe(req, res, next, {controller: cont.create, ...returnThisRouteRules('/', 'post', routes)}));
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
        path:path,
        method:method,
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


    res.show = () => {
        // console.log('adminFolder',path.themeFolder+'/index.html')
        console.log('show',path.themeFolder);
        return res.sendFile(path.themeFolder + '/index.html')
    };
    res.admin = () => {
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
        let isPassed = false, the_id = null;
        console.log('we need check access...', accessList, req.headers.token);
        if (!req.headers.token) {
            console.log('we have no token...');
            if(req.headers.response!=="json"){
                return res.redirect('/admin/login')
            }else {
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

export default {};

console.log('#f routes/index')

import express from 'express';
import path from "path";
// const publicFolder = path.join(__dirname, "./public");
// import _ from 'loadash';
// import menu from "#routes/menu";
import controller from "#controllers/index";
// import post from "#routes/post";
// import settings from "#routes/settings";
import mongoose from "mongoose";
// import user from "#routes/default/user/index";

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
var Models=[];
export function createRoute(modelName, routes,label) {
    const router = express.Router();

    console.log('    in createRoute...',label, modelName)

    // let model = global.models[modelName];
    let model = mongoose.model(modelName);
    Models[modelName]=model;
    // console.log('    in model...', model)

    // console.log('Object.keys(mongoose.models)',Object.keys(mongoose.models))
    // Object.keys(mongoose.models).forEach((model, is) => {
    //     console.log('model', model);
    //     // let schema = mongoose.model(model).schema.paths;
    // });
    //define theme paths
    //define plugin paths


    // router.post('/login', userController.login);
    // router.use(loggingMiddleware);
    // router.get('/', userController.all);
    // router.get('/:offset/:limit', userController.all);
    // router.get('/all/:offset/:limit', userController.all);
    // router.get('/all/:offset/:limit/:search', userController.all);
    // router.get('/:id', userController.viewOne);
    // router.get('/view/:id', userController.viewOne);
    // router.get('/count', userController.count);
    // router.post('/', userController.register);
    // router.post('/register', userController.register);
    // router.put('/:id', userController.edit);
    // router.delete('/:id', userController.destroy);
    let cont = controller(Models[modelName]);
    router.get('/', cont.all);
    router.get('/count', cont.all);
    // router.get('/edit/:id', (req, res, next) => {
    //     res.sendFile(path.join(__dirname, "./theme/admin/index.html"))
    // });
    router.get('/:offset/:limit', cont.all);
    router.get('/:id', cont.viewOne);
    //
    router.post('/', cont.create);
    router.put('/:id', cont.edit);
    router.delete('/:id', cont.destroy);
    // console.log('createRoute for:',modelName,label);

    return create_standard_route('', routes, router)


    return router;
}

export function createPublicRoute(suf='', routes) {
    // console.log('createPublicRoute ...');
    const router = express.Router();

    return create_standard_route(suf, routes, router)
    // return [router];
}

function make_routes_safe(req, res, next, func) {
    res.show = () => {
        // console.log('adminFolder',path.themeFolder+'/index.html')

        return res.sendFile(path.themeFolder+'/index.html')
    };
    res.admin = () => {
        // console.log('adminFolder',path.adminFolder+'/index.html')
        return res.sendFile(path.adminFolder+'/index.html')
    };

    req.models = ()=>{
         var models = mongoose.modelNames()
        return models;
    };
    req.adminRules = ()=>{
         // var models = mongoose.modelNames()
        return models;
    };
    return func(req, res, next)
}

function create_standard_route(suf = '/', routes=[], router) {
    // console.log('create_standard_route suf:',suf)
    if (routes)
        routes.forEach((rou) => {

            if (rou.path && rou.controller) {
                // console.log('\t added ' + rou.method + ' route:', suf + rou.path)

                if (rou.method === 'get') {

                    router.get(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, rou.controller));
                }
                if (rou.method === 'post') {

                    router.post(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, rou.controller));
                }
                if (rou.method === 'put') {
                    router.put(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, rou.controller));
                }
                if (rou.method === 'delete') {
                    router.delete(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, rou.controller));
                }
            }
        })
    return router
}

export default {};

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
var Models=[];
export function createRoute(modelName, routes,label) {
    let router = express.Router();
    console.log('in createRoute...',label, modelName)
    let model = mongoose.model(modelName);
    Models[modelName]=model;
    let cont = controller(Models[modelName]);
    router=create_standard_route('', routes, router);
    router.get('/', cont.all);
    router.get('/count', cont.all);
    router.get('/:offset/:limit', cont.all);
    router.get('/:id', cont.viewOne);
    router.post('/', cont.create);
    router.put('/:id', cont.edit);
    router.delete('/:id', cont.destroy);

    return router


}

export function createPublicRoute(suf='', routes) {
    // console.log('createPublicRoute ...');
    const router = express.Router();

    return create_standard_route(suf, routes, router)
    // return [router];
}

function make_routes_safe(req, res, next, rou) {
    req.mongoose = mongoose;

    if(rou.access){
        let accessList=rou.access.split(',');
        accessList.forEach((al)=>{

            al=al.trim().toLowerCase();
            al=al.charAt(0).toUpperCase() + al.slice(1)
                let theModel=mongoose.model(al);
            theModel.findOne(
                {
                    "tokens.token": req.headers.token
                },
                function (err, obj) {
                    if (err || !obj) {
                        return(err);
                    }
                    req.headers._id=obj._id;
                    // else {
                    // console.log('version:',version);
                    // if (customer) {

                    // return({
                    //     success: true,
                    //     message: "has access!",
                    //     entity: obj
                    // });
                }
            );
        })
        console.log('rou.access',rou.access);
    }
    res.show = () => {
        // console.log('adminFolder',path.themeFolder+'/index.html')

        return res.sendFile(path.themeFolder+'/index.html')
    };
    res.admin = () => {
        // console.log('adminFolder',path.adminFolder+'/index.html')
        return res.sendFile(path.adminFolder+'/index.html')
    };

    req.global = global;

    req.models = ()=>{
         var models = mongoose.modelNames()
        return models;
    };
    req.adminRules = ()=>{
         // var models = mongoose.modelNames()
        return models;
    };
    req.rules = (rules)=>{
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
    return rou.controller(req, res, next)
}

function create_standard_route(suf = '/', routes=[], router) {
    // console.log('create_standard_route suf:',suf)
    if (routes)
        routes.forEach((rou) => {

            if (rou.path && rou.controller) {

                if (rou.method === 'get') {

                    router.get(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, rou));
                }
                if (rou.method === 'post') {

                    router.post(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, rou));
                }
                if (rou.method === 'put') {
                    router.put(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, rou));
                }
                if (rou.method === 'delete') {
                    router.delete(suf + rou.path, (req, res, next) => make_routes_safe(req, res, next, rou));
                }
            }
        })
    return router
}

export default {};

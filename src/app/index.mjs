console.log("#f index.mjs", new Date());

import express from "express";

import db from "#root/app/db";
import path from "path";
// import ssrHandle from "#root/app/ssrHandle";
import global from "#root/global";
import configHandle from "#root/app/configHandle";
import routeHandle from "#root/app/routeHandle";
import headerHandle from "#root/app/headerHandle";
import User from "#routes/default/user/index";
import Settings from "#routes/default/settings/index";
import Page from "#routes/default/page/index";
// import Post from "#routes/default/post/index";
import Menu from "#routes/default/menu/index";
// import router from "../routes/public/p";
// import uploadHandle from "#root/app/uploadHandle";


export default function BaseApp(theProps = {}) {
    // if(!props){
    let props = {};
    // }
    props = theProps;
    console.log("==> BaseApp()", new Date());
    console.log('base:', props['base'])

    if (!props['base']) {
        props['base'] = '';
    }

    console.log('base:', props['base'])
    if (!props['entity']) {
        props['entity'] = [];
    }

    props['entity'].push(User);
    props['entity'].push(Settings);
    props['entity'].push(Page);
    props['entity'].push(Menu);
//make routes standard
    // console.log('rules',rules);
    if (!props['front']) {
        props['front'] = {
            routes: [{
                "path": "/",
                "method": "get",
                "access": "customer,admin",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            }, {
                "path": "/login",
                "method": "get",
                "access": "customer,admin",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            }, {
                "path": "/theme",
                "method": "get",
                "access": "customer,admin",
                "controller": (req, res, next) => {
                    console.log('get theme settings... ');
                    let rules = {};
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
                        // }else{

                        // console.log('schema',schema)
                        // if (!rules[identifire]['create']['fields'])
                        //     rules[identifire]['create']['fields'] = schema;
                        // if (!rules[identifire]['edit']['fields'])
                        //     rules[identifire]['edit']['fields'] = [];
                        // if (!rules[identifire]['list']['header'])
                        //     rules[identifire]['list']['header'] = [];

                        // }
                        // console.log('en',en)
                    })
                    // console.log('rules', rules);

                    res.json({
                        header: [{name: 'MainSidebar'}, {name: 'StickyCard'}, {name: 'CardSidebar'}, {name: 'MainNavbar'}, {name: 'MainMobileNavbar'}],
                        body: [{name: 'MainContent'}],
                        footer: [{name: 'MainFooter'}],
                        routes: [
                            {
                                path: '/',
                                exact: true,
                                layout: 'Nohf',
                                element: 'Home',
                            },
                            {
                                path: '/admin',
                                exact: true,
                                layout: 'Nohf',
                                element: 'Admin',
                            },
                        ],
                        models: req.models(),
                        rules: JSON.parse(JSON.stringify(rules))

                    })
                },

            }]
        };
    }
    if (!props['admin']) {
        props['admin'] = {
            routes: [{
                "path": "/admin",
                "method": "get",
                "access": "customer,admin",
                "controller": (req, res, next) => {
                    // console.log('here');
                    return res.admin()
                },

            }, {
                "path": "/admin/routes",
                "method": "get",
                "access": "customer,admin",
                "controller": (req, res, next) => {
                    // console.log('here');
                    return res.json({
                        success: 'sss'
                    })
                },

            }]
        };
    }
    // console.log(props['entity'], props['entity'])
    // if (!props['front']) {
    //     props['front']=false;
    // }
    // if (!props['admin']) {
    //     props['admin']=false;
    // }
// console.log('index props',props)
    let app = express();
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.header('origin'));
        // res.json(props);
        req.props = props;
        next();
    });

    db(props, app).then(e => {
        headerHandle(app);
        configHandle(express, app, props);

        app.use(function (err, req, res, next) {
            // console.log('here....');
            if (req.busboy) {
                req.pipe(req.busboy);

                req.busboy.on("file", function (
                    fieldname,
                    file,
                    filename,
                    encoding,
                    mimetype
                ) {
                    // ...
                    // console.log('on file app', mimetype,filename);

                    let fstream;
                    let name = (global.getFormattedTime() + filename).replace(/\s/g, '');

                    if (mimetype.includes('image')) {
                        // name+=".jpg"
                    }
                    if (mimetype.includes('video')) {
                        // name+="mp4";
                    }
                    let filePath = path.join(__dirname, "/public_media/customer/", name);
                    fstream = fs.createWriteStream(filePath);
                    file.pipe(fstream);
                    fstream.on("close", function () {
                        // console.log('Files saved');
                        let url = "customer/" + name;
                        let obj = [{name: name, url: url, type: mimetype}];
                        req.photo_all = obj;
                        next();
                    });
                });
            } else {
                next();
            }
        });
// ssrHandle(app);

        routeHandle(app, props);
// app.set("view engine", "pug");
        console.log('return app in BaseApp()')
    });
    // app.get("/", (req, res, next) => {
    //     console.log('#r home /')
    //     next();
    // });
    return app;

}
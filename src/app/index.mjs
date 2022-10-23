// console.log("#f index.mjs", new Date());

import express from "express";

import db from "#root/app/db";
import path from "path";
// import ssrHandle from "#root/app/ssrHandle";
import global from "#root/global";
import configHandle from "#root/app/configHandle";
import routeHandle from "#root/app/routeHandle";
import headerHandle from "#root/app/headerHandle";
import Admin from "#routes/default/admin/index";
import Settings from "#routes/default/settings/index";
import Page from "#routes/default/page/index";
import Customer from "#routes/default/customer/index";
import Menu from "#routes/default/menu/index";
import Template from "#routes/default/template/index";
import Media from "#routes/default/media/index";
import Post from "#routes/default/post/index";
import Notification from "#routes/default/notification/index";
// import router from "../routes/public/p";
// import uploadHandle from "#root/app/uploadHandle";


export default function BaseApp(theProps = {}) {
    // if(!props){
    let props = {};
    // }
    props = theProps;
    // console.log("==> BaseApp()", new Date());
    // console.log('base:', props['base'])

    if (!props['base']) {
        props['base'] = '';
    }

    // console.log('base:', props['base'])
    if (!props['entity']) {
        props['entity'] = [];
    }

    props['entity'].push(Admin);
    props['entity'].push(Settings);
    props['entity'].push(Page);
    props['entity'].push(Menu);
    props['entity'].push(Customer);
    props['entity'].push(Post);
    props['entity'].push(Media);
    props['entity'].push(Notification);
    props['entity'].push(Template);
//make routes standard
    // console.log('rules',rules);
    if (!props['front']) {
        props['front'] = {
            routes: [{
                "path": "/",
                "method": "get",
                "access": "customer_all",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            }, {
                "path": "/login",
                "method": "get",
                "access": "customer_all",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            },{
                "path": "/login/:_action",
                "method": "get",
                "access": "customer_all",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            }, {
                "path": "/product/:_id/:_slug",
                "method": "get",
                "access": "customer_all",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            }, {
                "path": "/post/:_id/:_slug",
                "method": "get",
                "access": "",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            }, {
                "path": "/chat",
                "method": "get",
                "access": "admin_user,admin_shopManager,customer_all",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            },{
                "path": "/transaction",
                "method": "get",
                "access": "customer_all",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            },
                {
                    "path": "/theme",
                    "method": "get",
                    "access": "",
                    "controller": (req, res, next) => {
                        console.log('get theme settings... ', req.headers.token);
                        let Template = req.mongoose.model('Template');

                        let rules = {};
                        rules = req.rules(rules);
                        // console.log('rules', rules);
                        Template.findOne({type: 'header'}, function (err, header) {
                            // console.log('header error',err);
                            // console.log('header',header);
                            Template.findOne({type: 'footer'}, function (err, footer) {
                                // console.log('footer error',err);
                                // console.log('footer',footer);
                                if (req.headers.token) {

                                }
                                // let headerMaxWidth='100%';
                                // if()
                                return res.json({
                                    header: {
                                        maxWidth: (header && header.maxWidth) ? header.maxWidth : '100%',
                                        elements: header ? header.elements : []
                                    },
                                    body: [{name: 'MainContent'}],
                                    footer: {
                                        maxWidth: (footer && footer.maxWidth) ? footer.maxWidth : '100%',
                                        elements: footer ? footer.elements : []
                                    },
                                    routes: [
                                        {
                                            path: '/',
                                            exact: true,
                                            layout: 'DefaultLayout',
                                            element: 'Home',
                                        },

                                        {
                                            path: '/chat',
                                            exact: true,
                                            layout: 'Nohf',
                                            element: 'Chat',
                                        }, {
                                            path: '/transaction',
                                            exact: true,
                                            layout: 'Nohf',
                                            element: 'Transaction',
                                        },
                                        {
                                            path: '/admin',
                                            exact: true,
                                            layout: 'Nohf',
                                            element: 'Admin',
                                        }, {
                                            path: '/admin/:model',
                                            exact: true,
                                            layout: 'Nohf',
                                            element: 'Admin',
                                        }, {
                                            path: '/admin/:model/:action',
                                            exact: true,
                                            layout: 'Nohf',
                                            element: 'Admin',
                                        }, {
                                            path: '/admin/:model/:action/:_id',
                                            exact: true,
                                            layout: 'Nohf',
                                            element: 'Admin',
                                        },
                                        {
                                            "path": "/a/:_entity/:_id/:_slug",
                                            "method": "get",
                                            "access": "customer_all",
                                            "controller": (req, res, next) => {
                                                console.log('show front, go visit ', process.env.SHOP_URL);
                                                res.show()
                                            },

                                        },
                                    ],
                                    models: req.models(),
                                    rules: JSON.parse(JSON.stringify(rules)),
                                    components: req.builderComponents(),

                                })

                            });
                        });
                    },

                },
                {
                    "path": "/:_slug",
                    "method": "get",
                    "access": "customer_all",
                    "controller": (req, res, next) => {
                        console.log('show front, go visit ', process.env.SHOP_URL);
                        res.show()
                    },

                },{
                    "path": "/a/:_entity/:_id/:_slug",
                    "method": "get",
                    "access": "customer_all",
                    "controller": (req, res, next) => {
                        console.log('show front, go visit ', process.env.SHOP_URL);
                        res.show()
                    },

                },]
        };
    }
    if (!props['admin']) {
        props['admin'] = {
            routes: [{
                "path": "/admin",
                "method": "get",
                "access": "admin_user,admin_shopManager",
                "controller": (req, res, next) => {
                    // console.log('here');
                    return res.admin()
                },

            }, {
                "path": "/admin/login",
                "method": "get",
                "access": "",
                "controller": (req, res, next) => {
                    console.log('/admin/login');
                    return res.admin()
                },

            }, {
                "path": "/admin/routes",
                "method": "get",
                "access": "admin_user,admin_shopManager",
                "controller": (req, res, next) => {
                    // console.log('here');
                    return res.json({
                        success: 'sss'
                    })
                },

            }, {
                "path": "/admin/:model",
                "method": "get",
                "access": "",
                "controller": (req, res, next) => {
                    // console.log('here');
                    if (req.headers.response != 'json')
                        return res.admin()
                },

            }, {
                "path": "/admin/:model/:action",
                "method": "get",
                "access": "",
                "controller": (req, res, next) => {
                    // console.log('here');
                    if (req.headers.response != 'json')
                        return res.admin()
                },

            }, {
                "path": "/admin/:model/:action/:id",
                "method": "get",
                "access": "",
                "controller": (req, res, next) => {
                    // console.log('here');
                    if (req.headers.response != 'json')
                        return res.admin()
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
        if (theProps.server)
            theProps.server.forEach(serv => {
                serv(app);
            });
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
//         console.log('return app in BaseApp()')
    });
    // app.get("/", (req, res, next) => {
    //     console.log('#r home /')
    //     next();
    // });
    return app;

}
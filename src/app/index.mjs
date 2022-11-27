// console.log("#f index.mjs", new Date());

import express from "express";
import React from 'react';

import db from "#root/app/db";
import path from "path";
import mongoose from "mongoose";
// import ssrHandle from "#root/app/ssrHandle";
import global from "#root/global";
import configHandle from "#root/app/configHandle";
import routeHandle from "#root/app/routeHandle";
import headerHandle from "#root/app/headerHandle";
import Admin from "#routes/default/admin/index";
import Settings from "#routes/default/settings/index";
import Page from "#routes/default/page/index";
import CustomerGroup from "#routes/default/customerGroup/index";
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
    props['entity'].push(CustomerGroup);
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
                    let Settings = req.mongoose.model('Settings');
                    // console.log('obj', obj)
                    Settings.findOne({}, "title header_last", function (err, hea) {
                        console.log('hea', hea)
                        if (!hea) {
                            hea = {}
                        }
                        res.ssrParse().then(body => {
                            body = body.replace('</head>', `<title>${(hea.title && hea.title[req.headers.lan]) ? hea.title[req.headers.lan] : 'Nodeeweb'}</title></head>`);

                            // body = body.replace('</head>', `<title>${hea.title}</title></head>`);
                            body = body.replace('</head>', `<meta name="description" content="${hea.metadescription}" /></head>`);
                            // body = body.replace('</head>', `<meta name="product_id" content="${obj._id}" /></head>`);
                            // body = body.replace('</head>', `<meta name="product_name" content="${obj.product_name}" /></head>`);
                            // body = body.replace('</head>', `<meta name="product_price" content="${obj.product_price}" /></head>`);
                            // body = body.replace('</head>', `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`);

                            body = body.replace('</head>', (hea && hea.header_last) ? hea.header_last : "" + `</head>`);

                            res.status(200).send(body);
                        })
                    })
                    // res.show()
                },

            }, {
                "path": "/login",
                "method": "get",
                "access": "customer_all",
                "controller": (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show()
                },

            }, {
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
                    console.log('show /product/:_id/:_slug, /app/index.mjs line: 90 ', process.env.SHOP_URL);
                    console.log('req.params._id', req.params);
                    const arrayMin = (arr) => {
                        if (arr && arr.length > 0)
                            return arr.reduce(function (p, v) {
                                return (p < v ? p : v);
                            });
                    };
                    let obj = {};
                    if (req.mongoose.isValidObjectId(req.params._slug)) {
                        obj["_id"] = req.params._slug;
                    } else {
                        obj["slug"] = req.params._slug;

                    }
                    if (req.mongoose.isValidObjectId(req.params._id)) {
                        obj["_id"] = req.params._id;
                        delete obj["slug"];
                    }
                    let Product = req.mongoose.model('Product');
                    let Settings = req.mongoose.model('Settings');
                    console.log('obj', obj)
                    Settings.findOne({}, "header_last", function (err, hea) {
                        console.log('hea', hea)
                        Product.findOne(obj, "title metadescription keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                            function (err, product) {
                                if (err || !product) {
                                    // resolve({});
                                    return res.json({
                                        success: false,
                                        error: err
                                    });
                                }
                                let in_stock = "outofstock";
                                let product_price = 0;
                                let product_old_price = 0;
                                let product_prices = [];
                                let product_sale_prices = [];
                                if (product.type === "variable") {
                                    if (product.combinations)
                                        _.forEach(product.combinations, (c) => {
                                            if (c.in_stock) {
                                                in_stock = "instock";
                                                product_prices.push(parseInt(c.price) || 1000000000000);
                                                product_sale_prices.push(parseInt(c.salePrice) || 1000000000000);
                                            }

                                        });
                                    // console.log("gfdsdf");
                                    // console.log(product_prices);
                                    // console.log(product_sale_prices);
                                    let min_price = arrayMin(product_prices);
                                    let min_sale_price = arrayMin(product_sale_prices);
                                    // console.log("min_price", min_price);
                                    // console.log("min_sale_price", min_sale_price);
                                    product_price = min_price;
                                    if (min_sale_price > 0 && min_sale_price < min_price) {
                                        product_price = min_sale_price;
                                        product_old_price = min_price;
                                    }
                                }
                                if (product.type === "normal") {
                                    if (product.in_stock) {
                                        in_stock = "instock";
                                    }
                                    if (product.price) {
                                        product_price = product.price;
                                    }
                                    if (product.price && product.salePrice) {
                                        product_price = product.salePrice;
                                        product_old_price = product.price;
                                    }
                                }

                                // product.title = product['title'][req.headers.lan] || '';
                                // product.description = '';
                                // console.log(c);
                                // });
                                delete product.data;
                                delete product.transaction;
                                console.log(" product", product);
                                let img = '';
                                if (product.photos && product.photos[0]) {
                                    img = product.photos[0]

                                }
                                if (product.thumbnail) {
                                    img = product.thumbnail
                                }

                                let obj = {
                                    _id: product._id,
                                    product_price: product_price || "",
                                    product_old_price: product_old_price || "",
                                    availability: in_stock || "",
                                    image: img,
                                    keywords: "",
                                    metadescription: "",
                                };
                                if (product["keywords"]) {
                                    obj["keywords"] = product["keywords"][req.headers.lan] || product["keywords"];

                                }
                                if (product["metadescription"]) {
                                    obj["metadescription"] = product["metadescription"][req.headers.lan] || product["metadescription"];

                                }
                                if (product["title"]) {
                                    obj["title"] = product["title"][req.headers.lan] || product["title"];
                                } else {
                                    obj["title"] = "";
                                }
                                if (product["title"]) {
                                    obj["product_name"] = product["title"][req.headers.lan] || product["title"];
                                } else {
                                    obj["product_name"] = "";
                                }
                                if (product["description"]) {
                                    obj["description"] = product["description"][req.headers.lan] || product["description"];
                                } else {
                                    obj["description"] = "";
                                }
                                if (product["slug"]) {
                                    obj["slug"] = product["slug"];
                                }
                                if (product["labels"]) {
                                    obj["labels"] = product["labels"];
                                }
                                if (!obj.metadescription) {
                                    obj.metadescription = obj["description"]
                                }
                                res.ssrParse().then(body => {
                                    body = body.replace('</head>', `<title>${obj.title}</title></head>`);
                                    body = body.replace('</head>', `<meta name="description" content="${obj.metadescription}" /></head>`);
                                    body = body.replace('</head>', `<meta name="product_id" content="${obj._id}" /></head>`);
                                    body = body.replace('</head>', `<meta name="product_name" content="${obj.product_name}" /></head>`);
                                    body = body.replace('</head>', `<meta name="product_price" content="${obj.product_price}" /></head>`);
                                    body = body.replace('</head>', `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`);
                                    body = body.replace('</head>', `<meta name="product_image" content="${obj.image}" /></head>`);
                                    body = body.replace('</head>', `<meta name="image" content="${obj.image}" /></head>`);
                                    body = body.replace('</head>', `<meta name="availability" content="${obj.availability}" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:image" content="${obj.image}" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:image:secure_url" content="${obj.image}" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:image:width" content="1200" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:image:height" content="675" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:locale" content="fa_IR" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:type" content="website" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:title" content="${obj.title}" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:description" content="${obj.description}" /></head>`);
                                    body = body.replace('</head>', `<meta name="og:url" content="." /></head>`);
                                    body = body.replace('</head>', (hea && hea.header_last) ? hea.header_last : "" + `</head>`);

                                    res.status(200).send(body);
                                })
                            }).lean();
                    })
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

            }, {
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
                        let Page = req.mongoose.model('Page');

                        let rules = {};
                        rules = req.rules(rules);
                        // console.log('rules', rules);
                        Template.findOne({type: 'header'}, function (err, header) {
                            // console.log('header error',err);
                            // console.log('header',header);
                            Template.findOne({type: 'footer'}, function (err, footer) {
                                let routes = [];
                                Page.find({}, function (err, pages) {
                                    if (pages)
                                        pages.forEach((page) => {
                                            if (page.path)
                                                routes.push({
                                                    path: page.path,
                                                    exact: true,
                                                    layout: 'DefaultLayout',
                                                    element: 'DynamicPage',
                                                    elements: page.elements || [],
                                                });
                                        })
                                    // console.log('footer error',err);
                                    // console.log('footer',footer);
                                    if (req.headers.token) {

                                    }
                                    // let headerMaxWidth='100%';
                                    // if()
                                    return res.json({
                                        header: {
                                            maxWidth: (header && header.maxWidth) ? header.maxWidth : '100%',
                                            backgroundColor: (header && header.backgroundColor) ? header.backgroundColor : '',
                                            classes: (header && header.classes) ? header.classes : '',
                                            padding: (header && header.padding) ? header.padding : '',
                                            elements: header ? header.elements : []
                                        },
                                        body: [{name: 'MainContent'}],
                                        footer: {
                                            maxWidth: (footer && footer.maxWidth) ? footer.maxWidth : '100%',
                                            backgroundColor: (footer && footer.backgroundColor) ? footer.backgroundColor : '',
                                            classes: (footer && footer.classes) ? footer.classes : '',
                                            padding: (footer && footer.padding) ? footer.padding : '',
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
                                            ...routes
                                        ],
                                        models: req.models(),
                                        rules: JSON.parse(JSON.stringify(rules)),
                                        components: req.builderComponents(),

                                    })
                                });

                            });
                        });
                    },

                },
                {
                    "path": "/admin",
                    "method": "get",
                    "access": "admin_user,admin_shopManager",
                    "controller": (req, res, next) => {
                        console.log('show admin');
                        return res.admin()
                    },

                },
                {
                    "path": "/admin/:model",
                    "method": "get",
                    "access": "",
                    "controller": (req, res, next) => {
                        console.log('/admin/:model line 402');
                        if (req.headers.response != 'json')
                            return res.admin()
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

                }, {
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
                    console.log('show admin');
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
        let Page = mongoose.model('Page');
        let routes = props['front'].routes.reverse() || [];

        Page.find({}, function (err, pages) {
            if (pages)
                pages.forEach((page) => {
                    if (page.path) {
                        console.log('page.path', page.path)
                        routes.push({
                            path: page.path,
                            method: 'get',
                            access: 'customer_all',
                            controller: (req, res, next) => {
                                console.log('show front, go visit ', process.env.SHOP_URL);
                                res.show()
                            },

                            layout: 'DefaultLayout',
                            element: 'DynamicPage',
                            elements: page.elements || [],
                        });
                    }
                })

            props['front'].routes = routes.reverse()

            // console.log('routes', props['front'].routes.reverse())
            // props['front'].routes=[...props['front'].routes,...routes]
            routeHandle(app, props);

        });
// app.set("view engine", "pug");
//         console.log('return app in BaseApp()')
    });
    // app.get("/", (req, res, next) => {
    //     console.log('#r home /')
    //     next();
    // });
    return app;

}
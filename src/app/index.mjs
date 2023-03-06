// console.log("#f index.mjs", new Date());
import "ignore-styles";
import express from "express";
import React from 'react';

import db from "#root/app/db";
import handlePlugins from "#root/app/handlePlugins";
import path from "path";
import mongoose from "mongoose";
// import ssrHandle from "#root/app/ssrHandle";
import global from "#root/global";
import configHandle from "#root/app/configHandle";
import routeHandle from "#root/app/routeHandle";
import headerHandle from "#root/app/headerHandle";
import Action from "#routes/default/action/index";
import Automation from "#routes/default/automation/index";
import Admin from "#routes/default/admin/index";
import Settings from "#routes/default/settings/index";
import Page from "#routes/default/page/index";
import CustomerGroup from "#routes/default/customerGroup/index";
import Customer from "#routes/default/customer/index";
import Menu from "#routes/default/menu/index";
import Template from "#routes/default/template/index";
import Media from "#routes/default/media/index";
import Post from "#routes/default/post/index";
import Form from "#routes/default/form/index";
import Entry from "#routes/default/entry/index";
import Notification from "#routes/default/notification/index";
import Gateways from "#routes/default/gateways/index";
import Category from "#routes/default/category/index";
import Task from "#routes/default/task/index";
import Note from "#routes/default/note/index";
import Document from "#routes/default/document/index";
import defaultFront from "#root/app/defaultFront";
import defaultAdmin from "#root/app/defaultAdmin";
import initScheduledJobs from "#root/app/scheduleHandle";

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

    props['entity'].push(Action);
    props['entity'].push(Automation);
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
    props['entity'].push(Form);
    props['entity'].push(Entry);
    props['entity'].push(Gateways);
    props['entity'].push(Task);
    props['entity'].push(Document);
    props['entity'].push(Note);
    props['entity'].push(Category);
//make routes standard
    // console.log('rules',rules);
    if (!props['front']) {
        props['front'] = {routes: defaultFront}

    }
    if (!props['admin']) {
        props['admin'] = {
            routes: defaultAdmin
        };
    }

    if (!props['plugin']) {
        props['plugin'] = [];
    }


    let app = express();
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.header('origin'));
        // res.json(props);
        req.props = props;
        next();
    });
    handlePlugins(props, app).then(fsl => {
        console.log('handlePlugins resolved()')
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
                initScheduledJobs(props);
                routeHandle(app, props);

            });
// app.set("view engine", "pug");
//         console.log('return app in BaseApp()')
        });
    })

    // app.get("/", (req, res, next) => {
    //     console.log('#r home /')
    //     next();
    // });
    return app;

}
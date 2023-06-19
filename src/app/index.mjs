// console.log("#f index.mjs", new Date());
import 'ignore-styles';
import express from 'express';
import React from 'react';

import db from '../app/db.mjs';
import handlePlugins from '../app/handlePlugins.mjs';
import path from 'path';
import mongoose from 'mongoose';
// import ssrHandle from "../app/ssrHandle";
import global from '../global.mjs';
import configHandle from '../app/configHandle.mjs';
import routeHandle from '../app/routeHandle.mjs';
import headerHandle from '../app/headerHandle.mjs';
import Action from '../routes/default/action/index.mjs';
import Automation from '../routes/default/automation/index.mjs';
import Admin from '../routes/default/admin/index.mjs';
import Settings from '../routes/default/settings/index.mjs';
import Page from '../routes/default/page/index.mjs';
import CustomerGroup from '../routes/default/customerGroup/index.mjs';
import Customer from '../routes/default/customer/index.mjs';
import Menu from '../routes/default/menu/index.mjs';
import Template from '../routes/default/template/index.mjs';
import Media from '../routes/default/media/index.mjs';
import Post from '../routes/default/post/index.mjs';
import Form from '../routes/default/form/index.mjs';
import Entry from '../routes/default/entry/index.mjs';
import Notification from '../routes/default/notification/index.mjs';
import Gateways from '../routes/default/gateways/index.mjs';
import Category from '../routes/default/category/index.mjs';
import Task from '../routes/default/task/index.mjs';
import Note from '../routes/default/note/index.mjs';
import Document from '../routes/default/document/index.mjs';
import Order from '../routes/order/index.mjs'
import Product from '../routes/product/index.mjs'
import ProductCategory from '../routes/productCategory/index.mjs'
import Attributes from '../routes/attributes/index.mjs'
import Discount from '../routes/discount/index.mjs'
import Transaction from '../routes/transaction/index.mjs'


import defaultFront from '../app/defaultFront.mjs';
import defaultAdmin from '../app/defaultAdmin.mjs';
import initScheduledJobs from '../app/scheduleHandle.mjs';
import { initiateAutomation } from '../routes/default/automation/utils.mjs';
import config from '../../config.mjs';

// import router from "../routes/public/p";
// import uploadHandle from "../app/uploadHandle";

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
  props['entity'].push(Order);
  props['entity'].push(Product);
  props['entity'].push(ProductCategory);
  props['entity'].push(Attributes);
  props['entity'].push(Discount);
  props['entity'].push(Transaction);

  //make routes standard
  // console.log('rules',rules);
  if (!props['front']) {
    props['front'] = { routes: defaultFront };
  }
  if (!props['admin']) {
    props['admin'] = {
      routes: defaultAdmin,
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
  handlePlugins(props, app).then((fsl) => {
    console.log('handlePlugins resolved()');
    db(props, app).then((e) => {
      initiateAutomation(mongoose.model('Automation'));
      headerHandle(app);
      configHandle(express, app, props);
      config.props = props;
      // props.global=global
      if (theProps.server)
        theProps.server.forEach((serv) => {
          serv(app);
        });
      app.use(function (err, req, res, next) {
        // console.log('here....');
        if (req.busboy) {
          req.pipe(req.busboy);

          req.busboy.on(
            'file',
            function (fieldname, file, filename, encoding, mimetype) {
              // ...
              // console.log('on file app', mimetype,filename);

              let fstream;
              let name = (global.getFormattedTime() + filename).replace(
                /\s/g,
                ''
              );

              if (mimetype.includes('image')) {
                // name+=".jpg"
              }
              if (mimetype.includes('video')) {
                // name+="mp4";
              }
              let filePath = path.join(
                __dirname,
                '/public_media/customer/',
                name
              );
              fstream = fs.createWriteStream(filePath);
              file.pipe(fstream);
              fstream.on('close', function () {
                // console.log('Files saved');
                let url = 'customer/' + name;
                let obj = [{ name: name, url: url, type: mimetype }];
                req.photo_all = obj;
                next();
              });
            }
          );
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
              console.log('page.path', page.path);
              if (page.path.indexOf('product-category') > -1) {
                routes.push({
                  path: page.path,
                  method: 'get',
                  access: 'customer_all',
                  controller: (req, res, next) => {
                    console.log(
                      'show /product-category/:_id, /index.mjs line: 606 '
                    );

                    let obj = {};

                    obj['slug'] = req.params._id;

                    let ProductCategory = req.mongoose.model('ProductCategory');
                    let Settings = req.mongoose.model('Settings');
                    console.log('\n\nobj', obj);
                    Settings.findOne({}, 'header_last', function (err, hea) {
                      // console.log('hea', hea)
                      ProductCategory.findOne(
                        obj,
                        'name metadescription metatitle excerpt thumbnail photos slug _id',
                        function (err, productCategory) {
                          if (err || !productCategory) {
                            // resolve({});
                            return res.json({
                              success: false,
                              error: err,
                            });
                          }

                          let img = '';
                          if (
                            productCategory.photos &&
                            productCategory.photos[0]
                          ) {
                            img = productCategory.photos[0];
                          }
                          if (productCategory.thumbnail) {
                            img = productCategory.thumbnail;
                          }

                          let obj = {
                            _id: productCategory._id,
                            image: img,
                            keywords: '',
                            metadescription: '',
                          };
                          if (productCategory['keywords']) {
                            obj['keywords'] =
                              productCategory['keywords'][req.headers.lan] ||
                              productCategory['keywords'];
                          }
                          if (productCategory['metadescription']) {
                            obj['metadescription'] =
                              productCategory['metadescription'][
                                req.headers.lan
                              ] || '';
                          }
                          if (
                            productCategory['name'] &&
                            productCategory['name'][req.headers.lan]
                          ) {
                            obj['name'] =
                              productCategory['name'][req.headers.lan];
                          } else {
                            obj['name'] = '';
                          }
                          if (
                            productCategory['name'] &&
                            productCategory['name'][req.headers.lan]
                          ) {
                            obj['productCategory_name'] =
                              productCategory['name'][req.headers.lan];
                          } else {
                            obj['productCategory_name'] = '';
                          }
                          if (
                            productCategory['description'] &&
                            productCategory['description'][req.headers.lan]
                          ) {
                            obj['description'] =
                              productCategory['description'][req.headers.lan];
                          } else {
                            obj['description'] = '';
                          }
                          if (productCategory['slug']) {
                            obj['slug'] = productCategory['slug'];
                          }
                          if (productCategory['labels']) {
                            obj['labels'] = productCategory['labels'];
                          }
                          if (!obj.metadescription) {
                            obj.metadescription = obj['metadescription'] || '';
                          }
                          let mainTitle = obj.name;
                          if (productCategory.metatitle) {
                            mainTitle = productCategory.metatitle[
                              req.headers.lan
                            ]
                              ? productCategory.metatitle[req.headers.lan]
                              : obj.name;
                          }
                          console.log(
                            'obj.metadescription',
                            obj.metadescription
                          );
                          res.ssrParse().then((body) => {
                            body = body.replace(
                              '</head>',
                              `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="productCategory_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="productCategory_name" content="${obj.productCategory_name}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="productCategory_image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<link rel="canonical" href="${process.env.SHOP_URL}product-category/${req.params._id}/" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<meta name="og:url" content="${process.env.SHOP_URL}product-category/${req.params._id}/" /></head>`
                            );
                            body = body.replace(
                              '</head>',
                              `<script type="application/ld+json">{"@context": "https://schema.org/","@type": "Product","name": "${mainTitle}","image": ["${process.env.SHOP_URL}${obj.image}"],"description": "${obj.metadescription}","offers": {"@type": "Offer","url": "${process.env.SHOP_URL}product-category/${req.params._id}","priceCurrency":"IRR","price": "${obj.productCategory_price}","priceValidUntil":"2024-07-22","availability": "https://schema.org/InStock","itemCondition": "https://schema.org/NewCondition"}}</script></head>`
                            );
                            body = body.replace(
                              '</head>',
                              hea && hea.header_last
                                ? hea.header_last
                                : '' + `</head>`
                            );

                            res.status(200).send(body);
                          });
                        }
                      ).lean();
                    });
                  },

                  layout: 'DefaultLayout',
                  element: 'DynamicPage',
                  elements: page.elements || [],
                });
              } else
                routes.push({
                  path: page.path,
                  method: 'get',
                  access: 'customer_all',
                  controller: (req, res, next) => {
                    console.log('show front, go visit ', process.env.SHOP_URL);
                    res.show();
                  },

                  layout: 'DefaultLayout',
                  element: 'DynamicPage',
                  elements: page.elements || [],
                });
            }
          });

        props['front'].routes = routes.reverse();

        // console.log('routes', props['front'].routes.reverse())
        // props['front'].routes=[...props['front'].routes,...routes]
        initScheduledJobs(props);
        routeHandle(app, props);
      });
      // app.set("view engine", "pug");
      //         console.log('return app in BaseApp()')
    });
  });

  // app.get("/", (req, res, next) => {
  //     console.log('#r home /')
  //     next();
  // });
  return app;
}

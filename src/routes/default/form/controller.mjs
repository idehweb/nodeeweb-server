import Product from "#models/product";
import Category from "#models/category";
import Media from "#models/media";
import requestIp from "request-ip";
import _ from "lodash";
import path from "path";
import fs from "fs";
import moment from "moment-jalaali";
import axios from "axios";
import mime from "mime";
import global from "#root/global";
import mongoose from "mongoose";
import CONFIG from "#c/config";
import {CollectContent, DownloadContent, OpenLinks, Root, Scraper} from 'nodejs-web-scraper';

let self = ({

    torob: function (req, res, next) {
        console.log("it is Torob!");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let searchf = {};
        searchf["title.fa"] = {
            $exists: true
        };
        // _id:'61d71cf4365a2313a161456c'
        Product.find({}, "_id title price type salePrice in_stock combinations", function (err, products) {
            if (err || !products) {
                res.json([]);
                retiurn;
                0;
            }

            function arrayMin(t) {
                var arr = [];
                t.map((item) => (item != 0) ? arr.push(item) : false);
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        console.log("p", p, "v", v);
                        return (p < v ? p : v);
                    });
                else
                    return false;
            }

            let modifedProducts = [];
            _.forEach(products, (c, cx) => {
                let price_array = [];
                let sale_array = [];
                let price_stock = [];
                let last_price = 0;
                let last_sale_price = 0;

                if (c.combinations && c.type == "variable") {
                    _.forEach(c.combinations, (comb, cxt) => {
                        if (comb.price && comb.price != null && parseInt(comb.price) != 0) {
                            price_array.push(parseInt(comb.price));
                        } else {
                            price_array.push(0);

                        }
                        if (comb.salePrice && comb.salePrice != null && parseInt(comb.salePrice) != 0) {
                            sale_array.push(parseInt(comb.salePrice));

                        } else {
                            sale_array.push(0);
                        }
                        if (comb.in_stock && !comb.quantity) {
                            comb.in_stock = false;
                        }
                        price_stock.push(comb.in_stock);
                        //
                        // if (parseInt(comb.price) < parseInt(last_price))
                        //     last_price = parseInt(comb.price);
                    });
                }
                if (c.type == "normal") {
                    price_array = [];
                    sale_array = [];
                    price_stock = [];
                    if (c.price && c.price != null)
                        price_array.push(c.price);
                }
                last_price = arrayMin(price_array);
                last_sale_price = arrayMin(sale_array);
                console.log("last price", last_price, last_sale_price);

                if ((last_price !== false && last_sale_price !== false) && (last_price < last_sale_price)) {
                    console.log("we have got here");
                    var cd = price_array.indexOf(last_price);
                    if (sale_array[cd] && sale_array[cd] != 0)
                        last_sale_price = sale_array[cd];
                    else
                        last_sale_price = false;
                    // if(sale_array[cd] && (sale_array[cd]<last_sale_price)){
                    //
                    // }

                } else if ((last_price !== false && last_sale_price !== false) && (last_price > last_sale_price)) {
                    console.log("we have got there");

                    // last_price = last_sale_price;
                    // last_sale_price = tem;

                    var cd = sale_array.indexOf(last_sale_price);
                    if (price_array[cd] && price_array[cd] != 0)
                        last_price = price_array[cd];
                    // else {
                    // last_sale_price = false;
                    var tem = last_price;

                    last_price = last_sale_price;
                    last_sale_price = tem;
                    // }
                }

                //
                // if (last_sale_price) {
                //     var tem = last_price;
                //     last_price = last_sale_price;
                //     last_sale_price = tem;
                //
                // }
                if (c.type == "normal") {
                    price_array = [];
                    sale_array = [];
                    price_stock = [];
                    if (c.in_stock) {
                        price_stock.push(true);
                    }
                    if (c.price && c.price != null)
                        price_array.push(c.price);
                }
                console.log("price_stock", price_stock);
                modifedProducts.push({
                    product_id: c._id,
                    page_url: CONFIG.SHOP_URL + "p/" + c._id + "/" + encodeURIComponent(c.title.fa),
                    price: last_price,
                    old_price: last_sale_price,
                    availability: (price_stock.indexOf(true) >= 0 ? "instock" : "outofstock")
                    // comb: price_array,
                    // combSale: sale_array,
                    // price_stock: price_stock,

                });
            });
            res.json(modifedProducts);
            return 0;


        }).skip(offset).sort({
            updatedAt: -1,
            createdAt: -1
            // "combinations.in_stock": -1,
        }).limit(parseInt(req.params.limit)).lean();
    },
    modifyPriceByCat: function (req, res, next) {
        console.log("modifyPriceByCat", req.body.type);
        let search = {}, type = req.body.type || null, number = req.body.number || 0;
        if (req.params._id) {

            search["$or"] = [{
                firstCategory: req.params._id
            }, {
                secondCategory: req.params._id
            }, {
                thirdCategory: req.params._id
            }];
        }

        if (req.body.selectedIds) {
            search["_id"] = {$in: req.body.selectedIds};
            delete search["$or"];
        }
        console.log("search", search);
        Product.find(search, "_id , combinations , options , price , salePrice , firstCategory , title  , type , thirdCategory , secondCategory", function (err, products) {
            if (err || !products) {
                res.json([]);
                return 0;
            }

            Product.countDocuments(search, function (err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                let ps = [], t = 0;
                _.forEach(products, (c, cx) => {
                    let theobj = {};
                    console.log("product #", cx);
                    if (c.type == "normal") {
                        if (c.price) {
                            products[cx].price = self.modifyPrice(type, number, c.price);
                        }

                        if (c.salePrice) {
                            products[cx].salePrice = self.modifyPrice(type, number, c.salePrice);

                        }
                        theobj["$set"] = {
                            price: products[cx].price,
                            salePrice: products[cx].salePrice
                        };

                    }
                    if (c.type == "variable") {
                        console.log("is variable...");
                        if (c.combinations) {
                            console.log("has combinations...");
                            _.forEach(c.combinations, (comb, combx) => {
                                if (comb.price && comb.price != 0 && comb.price != null) {
                                    console.log("combx", combx, comb.price);
                                    products[cx].combinations[combx].price = self.modifyPrice(type, number, comb.price);
                                    // if(cx==0)
                                    //     console.log('comb.price',comb.price,self.modifyPrice(type, number, comb.price));
                                }
                                if (comb.salePrice && comb.price != 0 && comb.price != null) {
                                    console.log("combx salePrice", combx, comb.salePrice);

                                    products[cx].combinations[combx].salePrice = self.modifyPrice(type, number, comb.salePrice);

                                }

                            });
                            theobj["$set"] = {
                                combinations: products[cx].combinations
                            };
                        }
                    }
                    // t++;
                    //
                    Product.findByIdAndUpdate(c._id, theobj, function (error, item) {
                        t++;
                        if (t == count) {
                            res.json(products);
                            return 0;

                        }
                    });

                });

                // console.log('t', t, count);
                // res.json(products);


            });

        }).lean();
    },
    modifyPrice(type, number, price) {

        price = parseInt(price);
        number = parseFloat(number);
        console.log("price number", number, price);
        var t = 0;
        if (type == "plusx") {
            t = parseInt(price + ((number * price) / 100));
            return t - (t % 1000) + 1000;
        } else if (type == "minusx") {
            t = parseInt(price - ((number * price) / 100));
            return t - (t % 1000) + 1000;

        } else if (type == "plusxp") {
            return parseInt(price + number);
        } else if (type == "minusxp") {
            return parseInt(price - number);
        } else {
            t = parseInt(price + ((number * price) / 100));
            return t - (t % 1000) + 1000;
        }
    },
    all: function (req, res, next) {
        console.log("get all products...");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.params.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.params.search,
                "$options": "i"
            };
        }
        if (req.query.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.search,
                "$options": "i"
            };
        }
        if (req.query.Search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.Search,
                "$options": "i"
            };
        }
        // if (req.query.type) {
        //     search['type'] = req.query.type
        // }else{
        //     search['type']='';
        // }
        if (req.query.id && req.query.kind == "bycat") {

            search["$or"] = [{
                firstCategory: req.query.id
            }, {
                secondCategory: req.query.id
            }, {
                thirdCategory: req.query.id
            }];
        }
        search["slug"] = {
            $exists: true
        };
        console.log("search", search);
        Product.find(search, "_id , views , combinations , options , price , salePrice , createdAt , updatedAt , firstCategory , title , thumbnail , type , thirdCategory , secondCategory , in_stock , quantity , status , slug", function (err, products) {
            if (err || !products) {
                res.json([]);
                return 0;
            }
            Product.countDocuments(search, function (err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                // _.forEach(options, (c, cx) => {
                //
                // });
                // console.log('req.headers',req.headers);
                // if(req.headers.user && req.headers.token) {
                //     let action = {
                //         user:req.headers.user._id,
                //         title:'get all products',
                //         data:products
                //     };
                //     global.submitAction(action);
                // }
                res.json(products);
                return 0;


            });

        }).skip(offset).sort({
            // createdAt: -1,
            "combinations.in_stock": -1,
            updatedAt: -1

            // "in_stock": 1,
        }).limit(parseInt(req.params.limit)).populate("firstCategory", "_id name slug").populate("secondCategory", "_id name slug").populate("thirdCategory", "_id name slug").lean();
    }
    ,
    allW: function (req, res, next) {
        // console.log('jhgfdghjk allW', req.params.search);
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        search["status"] = "published";
        search["slug"] = {
            $exists: true
        };
        search["title." + req.headers.lan] = {
            $exists: true
            // "$regex": req.query.search,
            // "$options": "i"
        };
        // search["description." + req.headers.lan] = {
        //     $exists: true
        // };
        if (req.params.search) {


            // search = {"title":{
            //
            //         [req.headers.lan]:{"$regex": req.query.search, "$options": "i"}
            //     }};

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.params.search,
                "$options": "i"
            };


        }
        if (req.query.country) {

            search["country"] = req.query.country;

        }
        if (req.query.type) {
            search["type"] = req.query.type;
        }
        if (!req.params.search) {

            // search['options'] = [];
            // search['combinations'] = [];
        }
        // console.log(search);

        Product.find(search, "_id title options firstCategory photos price salePrice quantity in_stock type thumbnail combinations labels slug")
            .sort({"combinations.in_stock": -1, "in_stock": -1, updatedAt: -1})
            .skip(offset).limit(parseInt(req.params.limit)).populate("firstCategory", "_id name slug").populate("secondCategory", "_id name slug").populate("thirdCategory", "_id name slug")
            .exec(function (err, products) {
                if (err || !products) {
                    res.json([]);
                    return 0;
                }
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        res.json([]);
                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(products, (c, cx) => {
                        // c.title = c['title'][req.headers.lan];
                        // c.firstCategory = {
                        //     _id: c.firstCategory._id,
                        //     name: c['catChoosed'][0]['name']
                        // }
                        // delete c.catChoosed;
                        // if (c.photos) {
                        //     _.forEach(c.photos, (f) => {
                        //         f=encodeURIComponent(f);
                        // //         if (f)
                        // //             if (f.type === 'image/jpeg' || f.type === 'image/png') {
                        // //                 c.backgroundImage = f.url;
                        // //                 delete c.files;
                        // //
                        // //                 return;
                        // //             }
                        // //
                        //     });
                        // }

                    });
                    // _.forEach(products, (c) => {
                    //     console.log(c.title)
                    //     // c.description =c['description'][req.headers.lan];
                    // });
                    // products.map(resource => ({ ...resource, id: resource._id }))
                    // console.log('fds');
                    res.json(products);
                    return 0;


                });

            });
    }
    ,
    allStory: function (req, res, next) {
        console.log('jhgfdghjk allW', req.params);
        let offset = 0;
        if (req.params.offset) {
            offset = (req.params.offset);
        }

        let search = {};
        search["status"] = "published";

        search["title." + req.headers.lan] = {
            $exists: true
            // "$regex": req.query.search,
            // "$options": "i"
        };
        search["slug"] = {
            $exists: true
        };
        // search["description." + req.headers.lan] = {
        //     $exists: true
        // };
        if (req.params.search) {


            // search = {"title":{
            //
            //         [req.headers.lan]:{"$regex": req.query.search, "$options": "i"}
            //     }};

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.params.search,
                "$options": "i"
            };


        }

        if (req.query.type) {
            search["type"] = req.query.type;
        }
        if (!req.params.search) {

            // search['options'] = [];
            // search['combinations'] = [];
        }
        // console.log(search);
        search["story"] = true;
        search["miniTitle." + req.headers.lan] = {
            $exists: true
        };
        console.log("search", search);
        Product.find(search, "_id miniTitle slug thumbnail firstCategory secondCategory thirdCategory")
            .skip(offset).limit(parseInt(req.params.limit)).populate("firstCategory", "_id name slug").populate("secondCategory", "_id name slug").populate("thirdCategory", "_id name slug")
            .exec(function (err, products) {
                if (err || !products) {
                    res.json([]);
                    return 0;
                }
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        res.json([]);
                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );

                    res.json(products);
                    return 0;


                });

            });
    }
    ,
    allS: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            // console.log('jhgfdghjk allS', req.query.search);
            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            search["status"] = "published";

            search["title." + req.headers.lan] = {
                $exists: true
                // "$regex": req.query.search,
                // "$options": "i"
            };
            search["description." + req.headers.lan] = {
                $exists: true
            };
            if (req.query.search) {


                // search = {"title":{
                //
                //         [req.headers.lan]:{"$regex": req.query.search, "$options": "i"}
                //     }};

                search["title." + req.headers.lan] = {
                    $exists: true,
                    "$regex": req.query.search,
                    "$options": "i"
                };


            }
            if (req.query.type) {
                search["type"] = req.query.type;
            }
            // console.log(search);
            Product.find(search, "_id title updatedAt status catChoosed firstCategory files price salePrice type", function (err, products) {
                if (err || !products) {
                    resolve([]);
                    return 0;
                }
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        resolve([]);

                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(products, (c) => {
                        c.title = c["title"][req.headers.lan];
                        c.firstCategory = {
                            _id: c.firstCategory._id,
                            name: c["catChoosed"][0]["name"]
                        };
                        delete c.catChoosed;
                        if (c.files) {
                            _.forEach(c.files, (f) => {
                                if (f)
                                    if (f.type === "image/jpeg" || f.type === "image/png") {
                                        c.backgroundImage = f.url;

                                        delete c.files;

                                        return;
                                    }

                            });
                        }
                        // c.firstCategory.name = c['catChoosed'][0]['name'];
                    });
                    // _.forEach(products, (c) => {
                    //     console.log(c.title)
                    //     // c.description =c['description'][req.headers.lan];
                    // });
                    // products.map(resource => ({ ...resource, id: resource._id }))
                    resolve(products);
                    // return 0;


                });

            }).skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit)).lean();
        });
    }
    ,
    bycat: function (req, res, next) {
        //console.log('productsByCat...');
        // console.log('jhgfdghjk', req.query.search || req.params.search);
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.query.type) {
            search["type"] = req.query.type;
        }
        search["status"] = "published";
        search["$or"] = [{
            firstCategory: req.params._id
        }, {
            secondCategory: req.params._id
        }, {
            thirdCategory: req.params._id
        }];
        if (req.query.search || req.params.search) {

            search = {"title": {"$regex": req.query.search || req.params.search, "$options": "i"}};


        }
        // search["title." + req.headers.lan] = {
        //     $exists: true
        // };
        // search["description." + req.headers.lan] = {
        //     $exists: true
        // };

        if (req.query.country) {

            search["country"] = req.query.country;

        }
        // if (!req.params.search) {
        //
        //     search['options'] = [];
        //     search['combinations'] = [];
        // }
        // '_id title photos updatedAt createdAt status',
// console.log('req.params',req.params);
        if (req.query && req.query.include) {
            search["_id"] = {$in: req.query.include};
        }
        // console.log(search)

// console.log('req.params',req.query.include);
        Product.find(search, "_id title options firstCategory secondCategory thirdCategory photos price salePrice type quantity in_stock thumbnail combinations labels")
            .sort({"combinations.in_stock": -1, "in_stock": -1, "updatedAt": 1})
            .skip(offset).limit(parseInt(req.params.limit))
            .exec(function (err, products) {
                if (err) {
                    res.json([]);
                    return 0;
                }
                if (!products) {
                    products = [];
                }
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err) {
                        res.json([]);
                        return 0;
                    }
                    if (!count) {
                        count = 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(products, (c) => {
                        //     c.title = c['title'][req.headers.lan];
                        //     c.description = c['description'][req.headers.lan];
                        //     c.firstCategory.name = c['firstCategory']['name'][req.headers.lan];
                        //
                        // c.title = c['title'][req.headers.lan];
                        // c.firstCategory = {
                        //     _id: c.firstCategory._id,
                        //     name: c['catChoosed'][0]['name']
                        // }
                        // delete c.catChoosed;
                        // if (c.files) {
                        //     _.forEach(c.files, (f) => {
                        //         if (f.type === 'image/jpeg' || f.type === 'image/png') {
                        //             c.backgroundImage = f.url;
                        //             delete c.files;
                        //
                        //             return;
                        //         }
                        //
                        //     });
                        // }
                    });

                    // products.map(resource => ({ ...resource, id: resource._id }))
                    res.json(products);
                    return 0;


                });

            });
    },
    productsByCat: function (req, res, next) {
        // console.log('productsByCat...');
        // console.log('jhgfdghjk', req.query.search || req.params.search);
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.query.type) {
            search["type"] = req.query.type;
        }

        search["status"] = "published";
        search["$or"] = [{
            firstCategory: req.params._id
        }, {
            secondCategory: req.params._id
        }, {
            thirdCategory: req.params._id
        }];
        if (req.query.search || req.params.search) {

            search = {"title": {"$regex": req.query.search || req.params.search, "$options": "i"}};


        }
        // search["title." + req.headers.lan] = {
        //     $exists: true
        // };
        // search["description." + req.headers.lan] = {
        //     $exists: true
        // };

        if (req.query.country) {

            search["country"] = req.query.country;

        }
        // if (!req.params.search) {
        //
        //     search['options'] = [];
        //     search['combinations'] = [];
        // }
        // '_id title photos updatedAt createdAt status',
// console.log('req.params',req.params);
        if (req.query && req.query.include) {
            search["_id"] = {$in: req.query.include};
        }

        // if (req.query.attr && req.query.value) {
        //   if(req.query.attr=='guarantee'){
        //
        //   }
        //   if(req.query.attr=='brand'){
        //     search["$or"].push({
        //       "extra_attr.title": "برند"
        //     });
        //     search["$or"].push({
        //       "extra_attr.title": "اپل"
        //     });
        //   }
        // }
        search["slug"] = {
            $exists: true
        };
        // console.log(search);

// console.log('req.params',req.query.include);
        Product.find(search, "_id title options firstCategory secondCategory thirdCategory photos price salePrice type quantity in_stock thumbnail combinations labels views slug")
            .sort({"combinations.in_stock": -1, "in_stock": -1, "updatedAt": 1})
            .skip(offset).limit((req.params.limit)).populate("firstCategory", "_id name slug").populate("secondCategory", "_id name slug").populate("thirdCategory", "_id name slug")
            .exec(function (err, products) {
                if (err) {
                    return res.json([]);
                    // return 0;
                }
                if (!products) {
                    products = [];
                }
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err) {
                        res.json([]);
                        return 0;
                    }
                    if (!count) {
                        count = 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    if (products.views)
                        products.views = products.views.length;
                    else
                        products.views = 0;
                    res.json(products);
                    return 0;


                });

            });
    }
    ,
    productsByCatS: function (req, res, next) {
        return new Promise(function (resolve, reject) {


            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            search["status"] = "published";
            search["$or"] = [{
                firstCategory: req.params._id
            }, {
                secondCategory: req.params._id
            }, {
                thirdCategory: req.params._id
            }];
            if (req.query.search) {

                search = {"title": {"$regex": req.query.search, "$options": "i"}};


            }
            // console.log(search)
            search["title." + req.headers.lan] = {
                $exists: true
            };
            search["description." + req.headers.lan] = {
                $exists: true
            };
            if (req.query.type) {
                search["type"] = req.query.type;
            }
            // '_id title photos updatedAt createdAt status',
            Product.find(search, "_id title updatedAt createdAt status catChoosed firstCategory photos type price salePrice", function (err, products) {
                if (err) {
                    resolve([]);

                }
                if (!products) {
                    products = [];
                }
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err) {
                        resolve([]);
                    }
                    if (!count) {
                        count = 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(products, (c) => {
                        //     c.title = c['title'][req.headers.lan];
                        //     c.description = c['description'][req.headers.lan];
                        //     c.firstCategory.name = c['firstCategory']['name'][req.headers.lan];
                        //
                        c.title = c["title"][req.headers.lan];
                        c.firstCategory = {
                            _id: c.firstCategory._id,
                            name: c["catChoosed"][0]["name"]
                        };
                        delete c.catChoosed;
                        if (c.files) {
                            _.forEach(c.files, (f) => {
                                if (f.type === "image/jpeg" || f.type === "image/png") {
                                    c.backgroundImage = f.url;
                                    delete c.files;

                                    return;
                                }

                            });
                        }
                    });

                    // products.map(resource => ({ ...resource, id: resource._id }))
                    resolve(products);
                    return 0;


                });

            }).skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit)).lean();
        });
    }
    ,
    allWCustomer: function (req, res, next) {
        // console.log('allWCustomer');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        search["title." + req.headers.lan] = {
            $exists: true
        };
        search["description." + req.headers.lan] = {
            $exists: true
        };
        search["customer"] = req.headers.customer._id;
        // search['status']='published';
        if (req.query.type) {
            search["type"] = req.query.type;
        }
        Product.find(search, "_id title photos updatedAt createdAt status views getContactData price type photos salePrice", function (err, products) {
            if (err || !products) {
                res.json([]);
                return 0;
            }

            Product.countDocuments(search, function (err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );

                _.forEach(products, (c) => {
                    // console.log(c.title)
                    // c.views = 0;
                    c.title = c["title"][req.headers.lan];
                    // console.log('views', c.views);

                    if (c.views) {

                        c.views = c.views.length;
                    } else {
                        c.views = 0;
                    }
                    if (c.getContactData) {

                        c.getContactData = c.getContactData.length;
                    } else {
                        c.getContactData = 0;
                    }
                    // c.description =c['description'][req.headers.lan];
                });
                // products.map(resource => ({ ...resource, id: resource._id }))
                res.json(products);
                return 0;


            });

        }).populate("firstCategory", "name slug").populate("customer", "nickname photos").skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit)).lean();
    }
    ,
    viewOne: function (req, res, next) {
        let obj = {};
        if (mongoose.isValidObjectId(req.params.id)) {
            obj["_id"] = req.params.id;
        } else {
            obj["slug"] = req.params.id;

        }
        Product.findOne(obj,
            function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!",
                        err: err
                    });
                    return 0;
                }
                // _.forEach(categorys, (c) => {
                // product.title = product['title'][req.headers.lan];
                // product.description = product['description'][req.headers.lan];
                // console.log(c);
                // });
                // delete product.data;
                // if (!product.getContactData) {
                //   product.getContactData = [];
                // }
                let views = product.views;
                if (!views) {
                    views = [];
                }

                views.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                });
                Product.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            // getContactData: product.getContactData,
                            views: views
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedProduct) {
                    });
                // delete product.views;
                if (product.views) {
                    product.views = product.views.length;
                } else {
                    product.views = 0;
                }
                if (product.like) {
                    product.like = product.like.length;
                } else {
                    product.like = 0;
                }
                delete product.getContactData;
                delete product.transaction;
                Product.findOne({_id: {$lt: req.params.id}}, "_id title", function (err, pl) {
                    if (pl && pl._id && pl.title)
                        product.nextProduct = {_id: pl._id, title: pl.title[req.headers.lan]};
                    res.json(product);
                    return 0;
                }).sort({_id: 1}).limit(1);


            }).populate("firstCategory", "_id name slug").populate("secondCategory", "_id name slug").populate("thirdCategory", "_id name slug").populate("customer", "nickname photos").lean();
    },
    like: function (req, res, next) {
        console.log("like product...");
        Product.findById(req.params._id,
            function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                let likes = product.like;
                if (!likes) {
                    likes = [];
                }
                let doWeNeedPush = true;
                _.forEach(likes, (l) => {
                    // console.log('l.customer',l.customer,'req.headers.customer._id',req.headers.customer._id);
                    if (l.customer.toString() === req.headers.customer._id.toString()) {
                        // console.log('set doWeNeedPush to false...');

                        doWeNeedPush = false;
                    }
                });
                if (doWeNeedPush) {
                    // console.log('doWeNeedPush');
                    likes.push({
                        userIp: requestIp.getClientIp(req),
                        customer: req.headers.customer._id
                    });
                } else {
                    res.json({
                        success: false,
                        message: "You have liked this before!"
                    });
                    return 0;
                }

                Product.findByIdAndUpdate(req.params._id, {
                        "$set": {
                            // getContactData: product.getContactData,
                            like: likes
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedProduct) {
                        console.log("like updatedProduct product...");

                        if (err || !updatedProduct) {
                            res.json({
                                success: false,
                                message: "error!"
                            });
                            return 0;
                        }
                        if (likes) {
                            product.like = likes.length;
                        } else {
                            product.like = 0;
                        }
                        res.json({
                            success: true,
                            like: product.like,
                            message: "successfully done!"
                        });
                    });

            }).lean();
    }
    ,
    viewOneA: function (req, res, next) {
        // console.log('viewOneA...');
        Product.findById(req.params.id,
            function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }

                if (product.combinations) {
                    // console.log('product.combinations...');
                    _.forEach(product.combinations, (comb, ct) => {
                        if (comb && comb.optionsId) {
                            // console.log('comb.optionsId...');
                            _.forEach(comb.optionsId, (optionId) => {
                                // console.log('getting optionId...', optionId);

                                _.forEach(product.options, (opts) => {
                                    // console.log('getting opts...', opts['name']);

                                    _.forEach(opts.values, (val) => {
                                        // console.log('getting opt values...', val);

                                        if (val["id"] == optionId) {
                                            if (!comb["options"]) {
                                                comb["options"] = {};
                                            }
                                            comb["options"][opts["name"]] = val["name"];
                                            // console.log('added to comb');
                                        }
                                    });
                                });
                            });

                        }
                    });
                }
                // console.log(product.combinations);
                // console.log('req.headers',req.headers);
                // if(req.headers.user && req.headers.token) {
                //     let action = {
                //         user:req.headers.user._id,
                //         title:'get product '+product._id,
                //         data:product,
                //         product:product._id
                //     };
                //     global.submitAction(action);
                // }
                res.json(product);
                // return 0;

            }).populate("firstCategory", "_id name").populate("secondCategory", "_id name").populate("thirdCategory", "_id name").populate("customer", "nickname photos").lean();
    }
    ,
    viewOneF: function (req, res, next) {

        Product.findById(req.params.id, "title _id price salePrice addToCard customer photos",
            function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                // _.forEach(categorys, (c) => {
                product.title = product["title"][req.headers.lan];
                let addToCard = product.addToCard;
                if (!addToCard) {
                    addToCard = [];
                }

                addToCard.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                });
                Product.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            // getContactData: product.getContactData,
                            addToCard: addToCard
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedProduct) {
                    });
                delete product.addToCard;
                product.seller = product.customer;
                delete product.customer;

                // Product.findOne({_id: {$lt: req.params.id}}, '_id title', function (err, pl) {
                //   if (pl && pl._id && pl.title)
                //     product.nextProduct = {_id: pl._id, title: pl.title[req.headers.lan]};
                //   return 0;
                // }).sort({_id: 1}).limit(1)

                res.json(product);

            }).lean();
    }
    ,
    viewOneS: function (req, res, next) {
        console.log("===> viewOneS() ");
        return new Promise(function (resolve, reject) {
            console.log('req.params._id', req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return (p < v ? p : v);
                    });
            };
            let obj = {};
            if (mongoose.isValidObjectId(req.params._slug)) {
                obj["_id"] = req.params._slug;
            } else {
                obj["slug"] = req.params._slug;

            }
            Product.findOne(obj, "title metadescription keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                function (err, product) {
                    if (err || !product) {
                        resolve({});
                        return 0;
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
                    if (product["product_name"]) {
                        obj["product_name"] = product["product_name"][req.headers.lan] || product["product_name"];
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
                    resolve(obj);
                    return 0;

                }).lean();
        });
    }
    ,
    getContactData: function (req, res, next) {

        Product.findById(req.params.id, "customer getContactData",
            function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                if (!product.getContactData) {
                    product.getContactData = [];
                }

                product.getContactData.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                });
                Product.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            getContactData: product.getContactData
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedProduct) {
                    });
                delete product.getContactData;
                res.json(product);
                return 0;

            }).populate("customer", "email phoneNumber").lean();
    }
    ,
    viewOneMyProduct: function (req, res, next) {
        // console.log('web uiwgeh  efkv', req.params.id);
        Product.findById(req.params.id,
            function (err, product) {
                // console.log('product', product);
                // console.log('err', err);
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!",
                        err: err
                    });
                    return 0;
                }
                product.title = product["title"][req.headers.lan];
                product.description = product["description"][req.headers.lan];
                product.files = product["files"];
                res.json(product);
                return 0;

            });
    }
    ,
    createByCustomer: function (req, res, next) {

        req.body.customer = req.headers.customer._id;
        if (!req.headers.lan) {
            req.headers.lan = "fa";
        }
        let {description, title} = req.body;
        delete req.body.description;
        req.body.description = {
            [req.headers.lan]: description
        };
        delete req.body.title;
        // req.body.description[req.headers.lan]=description;
        req.body.title = {
            [req.headers.lan]: title
        };
        // req.body.title[req.headers.lan]=title;
        // console.log()
        // console.log('creating product...', req.body.description, "..„");
        req.body.status = "published";
        let code = Math.floor(100000 + Math.random() * 900000);
        req.body.productNumber = code;
        Product.create(req.body, function (err, product) {
            if (err || !product) {
                res.json({
                    err: err,
                    success: false,
                    message: "error!"
                });
                return 0;
            }

            res.json(product);
            return 0;

        });
    }
    ,
    create: function (req, res, next) {
        function convertToSlug(Text) {
            return Text.toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
        }

        // req.body.customer = req.headers.customer._id;
        // console.log('creating product...', req.body);
        let slug = "";
        if (req.body && req.body.title && req.body.title.fa) {
            slug = convertToSlug(req.body.title.fa);
        }
        if (req.body && req.body.slug) {
            slug = convertToSlug(req.body.slug);

        }
        req.body.slug = slug;
        if (!slug) {
            return res.json({
                success: false,
                message: "slug is not entered!"
            })
        }

        if (!req.body.title) {
            return res.json({
                success: false,
                message: "title is not entered!"
            })
        }
        Product.create(req.body, function (err, product) {
            if (err || !product) {
                res.json({
                    err: err,
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log("req.headers", req.headers);
            if (req.headers.user && req.headers.token) {
                let action = {
                    user: req.headers.user._id,
                    title: "create product " + product._id,
                    data: product,
                    product: product._id
                };
                global.submitAction(action);
            }
            res.json(product);
            return 0;

        });
    }
    ,
    destroy: function (req, res, next) {
        Product.findByIdAndDelete(req.params.id,
            function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                // console.log("req.headers", req.headers);
                if (req.headers.user && req.headers.token) {
                    let action = {
                        user: req.headers.user._id,
                        title: "delete product " + product._id,
                        data: product,
                        product: product._id
                    };
                    global.submitAction(action);
                }
                res.json({
                    success: true,
                    message: "Deleted!"
                });
                return 0;


            }
        );
    }
    ,
    edit: function (req, res, next) {
        req.body.status = "published";
        req.body.customer = req.headers.customer._id;
        if (!req.headers.lan) {
            req.headers.lan = "en";
        }
        let {description, title} = req.body;
        delete req.body.description;
        req.body.description = {
            [req.headers.lan]: description
        };
        delete req.body.title;
        // req.body.description[req.headers.lan]=description;
        req.body.title = {
            [req.headers.lan]: title
        };
        // req.body.title[req.headers.lan]=title;
        // console.log()

        // console.log('creating product...', req.body.description, "..„");
        Product.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, product) {
            if (err || !product) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }

            res.json(product);
            return 0;

        });
    }
    ,
    editAdmin: function (req, res, next) {
        // console.log('editAdmin');
        if (!req.headers.lan) {
            req.headers.lan = "fa";
        }
        req.body.updatedAt = new Date();

        function convertToSlug(Text) {
            return Text.toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
        }

        // req.body.customer = req.headers.customer._id;
        // console.log('creating product...', req.body);
        let slug = "";
        if (req.body && req.body.title && req.body.title.fa) {
            slug = convertToSlug(req.body.title.fa);
        }
        if (req.body && req.body.slug) {
            slug = convertToSlug(req.body.slug);

        }
        req.body.slug = slug;
        Product.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, product) {
            if (err || !product) {
                res.json({
                    success: false,
                    message: "error!",
                    err: err,
                    id: req.params.id
                });
                return 0;
            }
            // console.log("req.headers", req.headers);

            if (req.headers.user && req.headers.token) {
                delete req.body.views;
                // delete req.body.views;
                let action = {
                    user: req.headers.user._id,
                    title: "edit product " + product._id,
                    data: product,
                    history: req.body,
                    product: product._id
                };
                global.submitAction(action);
            }
            res.json(product);
            return 0;

        }).populate("customer").populate("firstCategory").populate("secondCategory").populate("thirdCategory").select("-views");
    }
    ,
    copy: function (req, res, next) {
        if (!req.headers.lan) {
            req.headers.lan = "fa";
        }

        Product.findById(req.params.id, function (err, product) {
            if (err || !product) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            delete product._id;
            Product.create(product, function (err, product) {
                if (err || !product) {
                    res.json({
                        err: err,
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                // console.log("req.headers", req.headers);
                if (req.headers.user && req.headers.token) {
                    let action = {
                        user: req.headers.user._id,
                        title: "copy product " + product._id,
                        data: product,
                        history: req.body,
                        product: product._id
                    };
                    global.submitAction(action);
                }
                res.json(product);
                return 0;

            });


        }).lean();
    }
    ,
    telegram: function (req, res, next) {
        if (!req.headers.lan) {
            req.headers.lan = "fa";
        }
        req.params._id = req.params.id;
        self.viewOneS(req, res, next).then((product) => {
            console.log("fd", product);
            let objd = {};
            $tz = product.title + "\n";
            if (product.labels) {
                $tz += "\n";
                product.labels.forEach((label) => {
                    $tz += "\n📌" + label["title"];
                });
            }
            $tz += "\n💰 قیمت: " + (product.product_old_price || product.product_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " تومان";
            $tz += "\n\n🛒 برای خرید روی لینک زیر 👇 کلیک کنید:" + "\n" + global.domain + "/p/" + req.params._id + "/" + encodeURIComponent(product.slug);
            $tz += "\n\n📅 این قیمت در تاریخ " + moment().format("jYYYY/jM/jD") + " معتبر می باشد.";
            objd.message = $tz;

            if (product.image) {
                objd.media = global.domain + "/" + product.image;
            }
            console.log("objd", objd);
            global.publishToTelegram(objd, "arvandtech").then(function (f) {
                // console.log('f', f)

            });
        });
//         Product.findById(req.params.id, function (err, product) {
//             if (err || !product) {
//                 res.json({
//                     success: false,
//                     message: 'error!'
//                 });
//                 return 0;
//             }
//             console.log('req.headers', req.headers);
//             // if (req.headers.user && req.headers.token) {
//             //     let action = {
//             //         user: req.headers.user._id,
//             //         title: 'publish to telegram product ' + product._id,
//             //         data: product,
//             //         // history:req.body,
//             //         product: product._id
//             //     };
//             //     global.submitAction(action);
//             // }
//             let objd = {};
//             $tz = product.title[req.headers.lan] + "\n";
//             // $tz += product.description;
//             objd.message = $tz;
// // let im='';
//             if (product.photos) {
//                 if (product.photos[0]) {
//                     objd.media = global.domain + '/' + product.photos[0];
//                 }
//             }
//             console.log('objd', objd);
//             global.publishToTelegram(objd).then(function (f) {
//                 // console.log('f', f)
//
//             });
//
//
//             res.json(objd);
//             return 0;
//
//         });
    }
    ,
    deleteByCustomer: function (req, res, next) {
        Product.findByIdAndUpdate(req.params.id, {
            status: "deleted"
        }, function (err, product) {
            if (err || !product) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }

            res.json({
                success: true,
                message: "deleted!"
            });
            return 0;

        });
    }
    ,
    count: function (req, res, next) {
        Product.countDocuments({}, function (err, count) {
            // console.log('countDocuments', count);
            if (err || !count) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }

            res.json({
                success: true,
                count: count
            });
            return 0;


        });
    }
    ,
    fileUpload: function (req, res, next) {
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
                // console.log('on file app fieldname', fieldname);
                // console.log('on file app file', file);
                // console.log('on file app filename', filename);
                // console.log('on file app encoding', typeof filename['mimeType']);

                let fstream;
                console.log("global.getFormattedTime() + filename", global.getFormattedTime(), filename["filename"]);
                let name = (global.getFormattedTime() + filename.filename).replace(/\s/g, "");

                // if (filename.mimetype.toString().includes('image')) {
                //   // name+=".jpg"
                // }
                // if (filename.mimetype.toString().includes('video')) {
                //   // name+="mp4";
                // }
                let filePath = path.join(__dirname, "/../../public_media/customer/", name);
                console.log("on file app filePath", filePath);

                fstream = fs.createWriteStream(filePath);
                // console.log('on file app mimetype', typeof filename.mimeType);

                file.pipe(fstream);
                fstream.on("close", function () {
                    // console.log('Files saved');
                    let url = "customer/" + name;
                    let obj = [{name: name, url: url, type: mimetype}];
                    req.photo_all = obj;
                    let photos = obj;
                    if (photos && photos[0]) {
                        Media.create({
                            name: photos[0].name,
                            url: photos[0].url,
                            type: photos[0].type

                        }, function (err, media) {


                            if (err && !media) {


                                res.json({
                                    err: err,
                                    success: false,
                                    message: "error"
                                });

                            }
                            res.json({
                                success: true,
                                media: media

                            });

                        });
                    } else {
                        res.json({
                            success: false,
                            message: "upload faild!"
                        });
                    }
                });
            });
        } else {
            next();
        }
    }

});
export default self;
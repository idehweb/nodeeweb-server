// console.log("#f index.mjs", new Date());
import "ignore-styles";
import _ from "lodash";
import React from 'react';

const theme = (mode = 'admin', req, res, next) => {
    console.log('get theme settings... ', req.headers.token,mode);
    // return;

    let Settings = req.mongoose.model('Settings');
    let Template = req.mongoose.model('Template');
    let Page = req.mongoose.model('Page');
    Settings.findOne({},'currency tax taxAmount', function (err, setting) {
        console.log('setting',setting)
        Template.findOne({type: 'header'}, function (err, header) {
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
                    let currency = 'rial';
                    if (setting && setting.currency) {
                        currency = setting.currency;
                    }

                    let tax = false;
                    if (setting && setting.tax) {
                        tax = setting.tax;
                    }
                    let taxAmount = 0;
                    if (setting && setting.taxAmount) {
                        taxAmount = setting.taxAmount;
                    }
                    let lastObj = {
                        taxAmount: taxAmount,
                        tax: tax,
                        currency: currency,
                        header: {
                            maxWidth: (header && header.maxWidth) ? header.maxWidth : '100%',
                            backgroundColor: (header && header.backgroundColor) ? header.backgroundColor : '',
                            classes: (header && header.classes) ? header.classes : '',
                            padding: (header && header.padding) ? header.padding : '',
                            showInDesktop: (header && header.showInDesktop) ? header.showInDesktop : '',
                            showInMobile: (header && header.showInMobile) ? header.showInMobile : '',
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
                                path: '/transaction/:method',
                                exact: true,
                                layout: 'Nohf',
                                element: 'Transaction',
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
                        components: req.builderComponents(),

                    }
                    if (mode == 'admin') {
                        let rules = {};
                        rules = req.rules(rules);
                        lastObj['models'] = req.models()
                        lastObj['rules'] = JSON.parse(JSON.stringify(rules))
                    }
                    return res.json(lastObj)
                });

            });
        });
    });
}
export default [
    {
        "path": "/",
        "method": "get",
        "access": "customer_all",
        "controller": (req, res, next) => {
            console.log('show front, go visit ', process.env.SHOP_URL);
            let Settings = req.mongoose.model('Settings');
            // console.log('obj', obj)
            Settings.findOne({}, "title header_last body_first metadescription contactType areaServed availableLanguage factore_shop_name factore_shop_phoneNumber", function (err, hea) {
                console.log('hea', hea)
                if (!hea) {
                    hea = {}
                }
                let obj = {
                    title: (hea.title && hea.title[req.headers.lan]) ? hea.title[req.headers.lan] : 'Nodeeweb',
                    url: process.env.SHOP_URL,
                    logo: "",
                    phone: (hea.factore_shop_phoneNumber ? hea.factore_shop_phoneNumber : ""),
                    contactType: (hea.contactType ? hea.contactType : "customer service"),
                    areaServed: (hea.areaServed ? hea.areaServed : "IR"),
                    availableLanguage: (hea.availableLanguage ? hea.availableLanguage : "Persian"),
                }
                res.ssrParse().then(body => {
                    body = body.replace('</head>', `<title>${(hea.title && hea.title[req.headers.lan]) ? hea.title[req.headers.lan] : 'Nodeeweb'}</title></head>`);
                    if (hea && hea.metadescription)
                        body = body.replace('</head>', `<meta name="description" content="${hea.metadescription}" /></head>`);

                    body = body.replace('</head>', `<link rel="canonical" href="${process.env.SHOP_URL}" /></head>`);
                    body = body.replace('</head>', `<meta property="og:locale" content="fa_IR" /></head>`);
                    body = body.replace('</head>', `<meta property="og:type" content="website" /></head>`);
                    body = body.replace('</head>', `<meta property="og:title" content="${(hea.title && hea.title[req.headers.lan]) ? hea.title[req.headers.lan] : 'Nodeeweb'}" /></head>`);
                    if (hea && hea.metadescription)
                        body = body.replace('</head>', `<meta property="og:description" content="${hea.metadescription}" /></head>`);
                    body = body.replace('</head>', `<meta property="og:url" content="${process.env.SHOP_URL}" /></head>`);
                    body = body.replace('</head>', `<meta property="og:site_name" content="${(hea.factore_shop_name) ? hea.factore_shop_name : 'Nodeeweb'}" /></head>`);

                    // body = body.replace('</head>', `<title>${hea.title}</title></head>`);
                    // body = body.replace('</head>', `<meta name="product_id" content="${obj._id}" /></head>`);
                    // body = body.replace('</head>', `<meta name="product_name" content="${obj.product_name}" /></head>`);
                    // body = body.replace('</head>', `<meta name="product_price" content="${obj.product_price}" /></head>`);
                    // body = body.replace('</head>', `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`);
                    body = body.replace('</head>', `<script type="application/ld+json">{"@context": "https://schema.org","@type": "Organization","name": "${(hea.factore_shop_name) ? hea.factore_shop_name : 'Nodeeweb'}", "url": "${obj.url}", "logo": "${obj.logo}", "contactPoint": {"@type": "ContactPoint", "telephone": "${obj.phone}", "contactType": "customer service", "areaServed": "IR", "availableLanguage": "Persian", "sameAs": ["https://instagram.com", "https://twitter.com"]}}</script>` + '</head>');

                    body = body.replace('</head>', ((hea && hea.header_last) ? hea.header_last : "") + '</head>');
                    body = body.replace('<body>', '<body>' + ((hea && hea.body_first) ? hea.body_first : ""));

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
        "path": "/checkout",
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

    },
    {
        "path": "/product/:_id/:_slug",
        "method": "get",
        "access": "customer_all",
        "controller": (req, res, next) => {
            console.log('show /product/:_id/:_slug, /defaultFront.mjs line: 66 ', process.env.SHOP_URL);
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
                            body = body.replace('</head>', `<link rel="canonical" href="${process.env.SHOP_URL}product/${req.params._id}/${req.params._slug}/" /></head>`);
                            body = body.replace('</head>', `<meta name="product_id" content="${obj._id}" /></head>`);
                            body = body.replace('</head>', `<meta name="product_name" content="${obj.product_name}" /></head>`);
                            body = body.replace('</head>', `<meta name="product_price" content="${obj.product_price}" /></head>`);
                            body = body.replace('</head>', `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`);
                            body = body.replace('</head>', `<meta name="product_image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="availability" content="${obj.availability}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`);
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

    },
    {
        "path": "/product/:_slug",
        "method": "get",
        "access": "customer_all",
        "controller": (req, res, next) => {
            console.log('show /product/:_slug, /defaultFront.mjs line: 230 ', process.env.SHOP_URL);
            console.log('req.params._id', req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return (p < v ? p : v);
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._slug;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Product = req.mongoose.model('Product');
            let Settings = req.mongoose.model('Settings');
            console.log('\n\nobj', obj)
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
                            product_price: product_price || 0,
                            product_old_price: product_old_price || "",
                            availability: in_stock || false,
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
                            body = body.replace('</head>', `<meta name="product_image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<link rel="canonical" href="${process.env.SHOP_URL}product/${req.params._slug}/" /></head>`);
                            body = body.replace('</head>', `<meta name="image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="availability" content="${obj.availability}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image:width" content="1200" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image:height" content="675" /></head>`);
                            body = body.replace('</head>', `<meta name="og:locale" content="fa_IR" /></head>`);
                            body = body.replace('</head>', `<meta name="og:type" content="website" /></head>`);
                            body = body.replace('</head>', `<meta name="og:title" content="${obj.title}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:description" content="${obj.description}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:url" content="." /></head>`);
                            body = body.replace('</head>', `<script type="application/ld+json">{"@context": "https://schema.org/","@type": "Product","name": "${obj.title}","image": ["${process.env.SHOP_URL}${obj.image}"],"description": "${obj.description}","offers": {"@type": "Offer","url": "${process.env.SHOP_URL}product/${req.params._slug}","priceCurrency":"IRR","price": "${obj.product_price}","priceValidUntil":"2024-07-22","availability": "https://schema.org/InStock","itemCondition": "https://schema.org/NewCondition"}}</script></head>`);
                            body = body.replace('</head>', (hea && hea.header_last) ? hea.header_last : "" + `</head>`);

                            res.status(200).send(body);
                        })
                    }).lean();
            })
        },

    },
    {
        "path": "/post/:_id/:_slug",
        "method": "get",
        "access": "",
        "controller": (req, res, next) => {
            console.log('show front, go visit ', process.env.SHOP_URL);
            res.show()
        },

    },
    {
        "path": "/post/:_slug",
        "method": "get",
        "access": "",
        "controller": (req, res, next) => {
            // console.log('show front, go visit ', process.env.SHOP_URL);
            console.log('show front, go visit ', process.env.SHOP_URL);

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
            let Post = req.mongoose.model('Post');
            let Settings = req.mongoose.model('Settings');
            console.log('\n\nobj', obj)
            Settings.findOne({}, "header_last", function (err, hea) {
                console.log('hea', hea)
                Post.findOne(obj, "title metadescription keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, post) {
                        if (err || !post) {
                            // resolve({});
                            return res.json({
                                success: false,
                                error: err
                            });
                        }

                        console.log(" post", post);
                        let img = '';
                        if (post.photos && post.photos[0]) {
                            img = post.photos[0]

                        }
                        if (post.thumbnail) {
                            img = post.thumbnail
                        }

                        let obj = {
                            _id: post._id,
                            image: `${process.env.SHOP_URL}${img}`,
                            createdAt: post.createdAt,
                            updatedAt: post.updatedAt,
                            keywords: "",
                            url: `${process.env.SHOP_URL}post/${post.slug}/`,
                            metadescription: "",
                        };
                        if (post["keywords"]) {
                            obj["keywords"] = post["keywords"][req.headers.lan] || post["keywords"];

                        }
                        if (post["metadescription"]) {
                            obj["metadescription"] = post["metadescription"][req.headers.lan] || post["metadescription"];

                        }
                        if (post["title"]) {
                            obj["title"] = post["title"][req.headers.lan] || post["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (post["description"]) {
                            obj["description"] = post["excerpt"][req.headers.lan] || post["description"];
                        } else {
                            obj["description"] = "";
                        }
                        if (post["slug"]) {
                            obj["slug"] = post["slug"];
                        }
                        if (post["labels"]) {
                            obj["labels"] = post["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["description"]
                        }
                        console.log('obj', obj);
                        res.ssrParse().then(body => {
                            body = body.replace('</head>', `<title>${obj.title}</title></head>`);
                            body = body.replace('</head>', `<meta name="description" content="${obj.metadescription}" /></head>`);
                            body = body.replace('</head>', `<link rel="canonical" href="${process.env.SHOP_URL}/post/${req.params._slug}/" /></head>`);
                            body = body.replace('</head>', `<meta name="image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="availability" content="${obj.availability}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image:width" content="1200" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image:height" content="675" /></head>`);
                            body = body.replace('</head>', `<meta name="og:locale" content="fa_IR" /></head>`);
                            body = body.replace('</head>', `<meta name="og:type" content="website" /></head>`);
                            body = body.replace('</head>', `<meta name="og:title" content="${obj.title}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:description" content="${obj.description}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:url" content="." /></head>`);
                            body = body.replace('</head>', `<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "BlogPosting", "mainEntityOfPage": { "@type": "WebPage", "@id": "${obj.url}" }, "headline": "${obj.title}", "description": "${obj.description}", "image": "${obj.image}", "datePublished": "${obj.createdAt}", "dateModified": "${obj.updatedAt}" }</script></head>`);
                            body = body.replace('</head>', (hea && hea.header_last) ? hea.header_last : "" + `</head>`);

                            res.status(200).send(body);
                        })
                    }).lean();
            })
        },

    },
    {
        "path": "/chat",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_all",
        "controller": (req, res, next) => {
            console.log('show front, go visit ', process.env.SHOP_URL);
            res.show()
        },

    }, {
        "path": "/transaction/:method",
        "method": "get",
        "access": "customer_all",
        "controller": (req, res, next) => {
            console.log('show front, go visit ', process.env.SHOP_URL);
            res.show()
        },

    }, {
        "path": "/order-details/:id",
        "method": "get",
        "access": "customer_all",
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
            theme('admin', req, res, next)
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

    }, {
        "path": "/admin/theme",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": (req, res, next) => {
            console.log('show admin');
            theme('admin', req, res, next)

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
        "path": "/profile",
        "method": "get",
        "access": "customer_all",
        "controller": (req, res, next) => {
            console.log('show front, go visit ', process.env.SHOP_URL);

            res.show()
        },

    },
    {
        "path": "/my-orders",
        "method": "get",
        "access": "customer_all",
        "controller": (req, res, next) => {
            console.log('show front, go visit ', process.env.SHOP_URL);

            res.show()
        },

    },
    {
        "path": "/:_slug",
        "method": "get",
        "access": "customer_all",
        "controller": (req, res, next) => {
            console.log('show front, go visit ', process.env.SHOP_URL, req.params._slug);

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
            // if(obj.slug=='robots.txt'){
            //     return res.sendFile('../../../robots.txt')
            // }

            let Page = req.mongoose.model('Page');
            let Settings = req.mongoose.model('Settings');
            console.log('\n\nobj2', obj)

            Settings.findOne({}, "header_last", function (err, hea) {
                console.log('hea', hea)
                Page.findOne(obj, "title metadescription keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, page) {
                        if (err || !page) {
                            // resolve({});
                            return res.json({
                                success: false,
                                error: err
                            });
                        }

                        console.log(" page", page);
                        let img = '';
                        if (page.photos && page.photos[0]) {
                            img = product.photos[0]

                        }
                        if (page.thumbnail) {
                            img = product.thumbnail
                        }

                        let obj = {
                            _id: page._id,
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (page["keywords"]) {
                            obj["keywords"] = page["keywords"][req.headers.lan] || page["keywords"];

                        }
                        if (page["metadescription"]) {
                            obj["metadescription"] = page["metadescription"][req.headers.lan] || page["metadescription"];

                        }
                        if (page["title"]) {
                            obj["title"] = page["title"][req.headers.lan] || page["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (page["description"]) {
                            obj["description"] = page["description"][req.headers.lan] || page["description"];
                        } else {
                            obj["description"] = "";
                        }
                        if (page["slug"]) {
                            obj["slug"] = page["slug"];
                        }
                        if (page["labels"]) {
                            obj["labels"] = page["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["description"]
                        }
                        res.ssrParse().then(body => {
                            body = body.replace('</head>', `<title>${obj.title}</title></head>`);
                            body = body.replace('</head>', `<meta name="description" content="${obj.metadescription}" /></head>`);
                            body = body.replace('</head>', `<link rel="canonical" href="${process.env.SHOP_URL}/${req.params._slug}/" /></head>`);
                            body = body.replace('</head>', `<meta name="image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="availability" content="${obj.availability}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image" content="/${obj.image}" /></head>`);
                            body = body.replace('</head>', `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`);
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
            // res.show()
        },

    },
    {
        "path": "/a/:_entity/:_id/:_slug",
        "method": "get",
        "access": "customer_all",
        "controller": (req, res, next) => {
            console.log('show front, go visit ', process.env.SHOP_URL);
            res.show()
        },

    },]
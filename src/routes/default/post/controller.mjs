import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import https from 'https'

var self = ( {
    importFromWordpress: function (req, res, next) {
        let url = '';
        if (req.query.url) {
            url = req.query.url;
        }


        if (req.query.per_page) {
            url += '?per_page=' + req.query.per_page;
        }
        if (req.query.page) {
            url += '&page=' + req.query.page;
        }
        url += '&type=post';
        // url += '&_embed';

        console.log('importFromWordpress', url);
        let count = 0;
        req.httpRequest({
            method: "get",
            url: url,
        }).then(function (response) {
            count++;
            let x = count * parseInt(req.query.per_page)
            let Post = req.mongoose.model('Post');

            response.data.forEach((dat) => {
                let obj = {};
                if (dat.title) {
                    obj['title'] = {
                        fa: dat.title.rendered

                    }
                }
                if (dat.content) {
                    obj['description'] = {
                        fa: dat.content

                    }
                }

                if (dat.slug) {
                    obj['slug'] = dat.slug + 'x' + x;
                }else{
                    obj['slug'] = dat.title.rendered + 'x' + x;

                }
                // delete dat.yoast_head;
                // delete dat.yoast_head_json;
                obj['data'] = dat;
                obj['status'] = 'published';
                Post.create(obj)
            });
            // return res.json(response.data)
        });


    },
    rewritePosts: function (req, res, next) {
        let Post = req.mongoose.model('Post');
        let Media = req.mongoose.model('Media');
        Post.find({}, function (err, products) {
            _.forEach(products, (item) => {
                // console.log('item', item.data.short_description)
                // console.log('item', item.data.sku)
                // console.log('item', item.data.regular_price)
                // console.log('item', item.data.sale_price)
                // console.log('item', item.data.total_sales)
                // console.log('item', item.data.images)
                let photos = [];
                if (item.data && item.data.yoast_head_json && item.data.yoast_head_json.og_image ) {
                    _.forEach((item.data.yoast_head_json.og_image  ? item.data.yoast_head_json.og_image  : []), async (c, cx) => {
                        let mainUrl = encodeURI(c.url);
                        console.log('images[', cx, ']', mainUrl);

                        let filename =
                                c.url.split('/').pop(),
                            __dirname = path.resolve(),
                            name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
                            type = path.extname(name),
                            mimtype = mime.getType(type),
                            filePath = path.join(__dirname, "./public_media/customer/", name),
                            fstream = fs.createWriteStream(filePath);

                        https.get(mainUrl, function (response) {
                            console.log('getting mainUrl', mainUrl);
                            response.pipe(fstream);
                        });

                        // console.log('cx', cx);

                        fstream.on("close", function () {
                            // console.log('images[' + cx + '] saved');
                            let url = "customer/" + name,
                                obj = [{name: name, url: url, type: mimtype}];
                            Media.create({
                                name: obj[0].name,
                                url: obj[0].url,
                                type: obj[0].type

                            }, function (err, media) {
                                if (err) {
                                    // console.log({
                                    //     err: err,
                                    //     success: false,
                                    //     message: 'error'
                                    // })
                                } else {
                                    // console.log(cx, ' imported');

                                    photos.push(media.url);
                                    if (photos.length == item.data.yoast_head_json.og_image.length) {
                                        Post.findByIdAndUpdate(item._id, {photos: photos}, function (err, products) {
                                        })
                                    }
                                }
                            });

                        });


                    });
                } else {
                }
                // if (item.photos)
                //     Post.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, products) {
                //     })

            })
        })
    },
    setPostsThumbnail: function (req, res, next) {
        let Post = req.mongoose.model('Post');
        let Media = req.mongoose.model('Media');
        Post.find({}, function (err, products) {
            _.forEach(products, (item) => {
                // console.log('item', item.data.short_description)
                // console.log('item', item.data.sku)
                // console.log('item', item.data.regular_price)
                // console.log('item', item.data.sale_price)
                // console.log('item', item.data.total_sales)
                // console.log('item', item.data.images)
                // let photos = [];
                // if (item.data && item.data.yoast_head_json && item.data.yoast_head_json.og_image ) {
                //     _.forEach((item.data.yoast_head_json.og_image  ? item.data.yoast_head_json.og_image  : []), async (c, cx) => {
                //         let mainUrl = encodeURI(c.url);
                //         console.log('images[', cx, ']', mainUrl);
                //
                //         let filename =
                //                 c.url.split('/').pop(),
                //             __dirname = path.resolve(),
                //             name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
                //             type = path.extname(name),
                //             mimtype = mime.getType(type),
                //             filePath = path.join(__dirname, "./public_media/customer/", name),
                //             fstream = fs.createWriteStream(filePath);
                //
                //         https.get(mainUrl, function (response) {
                //             console.log('getting mainUrl', mainUrl);
                //             response.pipe(fstream);
                //         });
                //
                //         // console.log('cx', cx);
                //
                //         fstream.on("close", function () {
                //             // console.log('images[' + cx + '] saved');
                //             let url = "customer/" + name,
                //                 obj = [{name: name, url: url, type: mimtype}];
                //             Media.create({
                //                 name: obj[0].name,
                //                 url: obj[0].url,
                //                 type: obj[0].type
                //
                //             }, function (err, media) {
                //                 if (err) {
                //                     // console.log({
                //                     //     err: err,
                //                     //     success: false,
                //                     //     message: 'error'
                //                     // })
                //                 } else {
                //                     // console.log(cx, ' imported');
                //
                //                     photos.push(media.url);
                //                     if (photos.length == item.data.yoast_head_json.og_image.length) {
                //                         Post.findByIdAndUpdate(item._id, {photos: photos}, function (err, products) {
                //                         })
                //                     }
                //                 }
                //             });
                //
                //         });
                //
                //
                //     });
                // } else {
                // }
                if (item.photos)
                    Post.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, products) {
                    })

            })
        })
    }

});
export default self;
import Transaction from "#models/transaction";
import Order from "#models/order";
import Customer from "#models/customer";
import Link from "#models/link";
//const rp from "request-promise";
import request from "#root/request";

import global from "#root/global";
import CONFIG from "#c/config";

var self = ({
    buy: function (req, res, next) {
        console.log("buying...");
        Order.findById(req.params._id, "sum , orderNumber , amount",
            function (err, order) {
                if (err || !order) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }

                // obj[]=;

                let options = {
                    method: "POST",
                    url: "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
                    body: {
                        MerchantID: "186704d8-c6c7-49c4-a404-baf16abcb85d",
                        Amount: parseInt(order.amount),
                        CallbackURL: global.domain + "/" + "transaction",
                        Description: "سفارش #" + order.orderNumber
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                console.log(options);

                request(options, function (error, response, parsedBody) {
                    // rp(options)
                    //     .then(function (parsedBody) {
                    // console.log('parsedBody', parsedBody);

                    let obj = {
                        // 'customer': req.headers.customer._id,
                        "amount": order.amount,
                        "order": req.params._id,
                        Authority: parsedBody["Authority"]
                    };
                    Transaction.create(obj, function (err, transaction) {
                        if (parsedBody["Status"] == 100) {
                            return res.json({
                                success: true,
                                url: "https://www.zarinpal.com/pg/StartPay/" + parsedBody["Authority"] + "/ZarinGate"
                            });
                        } else {
                            return res.json({
                                success: false
                            });
                        }
                    });
                    // });
                });
            });

    },
    buyZibal: function (req, res, next) {
        console.log("buying...", req.params._id, req.params._price);
        if (req.params._price && (req.params._price == null || req.params._price == "null"))
            return res.json({
                success: false,
                message: "req.params._price"
            });
        global.getSetting("ZIBAL_TOKEN").then((merchant) => {
            console.log('merchant', merchant)
            Order.findById(req.params._id, "sum , orderNumber , amount , discount",
                function (err, order) {
                    if (err || !order) {
                        res.json({
                            success: false,
                            message: "error!"
                        });
                        return 0;
                    }

                    // obj[]=;
// console.log(order.amount/);
//                 return;
                    let amount = parseInt(order.amount) * 10;
                    if (req.params._price) {
                        amount = parseInt(req.params._price) * 10;
                    }
                    if (order.discount) {
                        amount = amount - (order.discount * 10);
                    }
                    if (amount < 0) {
                        amount = 0;
                    }
                    if (amount > 500000000) {
                        return res.json({
                            success: false,
                            message: "price is more than 50,000,000T"
                        });
                    }
                    let options = {
                        method: "POST",
                        url: "https://gateway.zibal.ir/v1/request",
                        body: {
                            merchant: merchant,
                            amount: amount,
                            callbackUrl: global.domain + "/" + "transaction",
                            description: "سفارش #" + order.orderNumber,
                            orderId: order.orderNumber
                        },
                        json: true // Automatically stringifies the body to JSON
                    };
                    console.log('options');
                    let $text;
                    $text = "customer is paying " + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Rial" + "\n" + "order number: # " + order.orderNumber + "\n" + CONFIG.ADMIN_URL + "/#/order/" + order._id + "\n";
                    $text += "customer phone number: " + order.customer.phoneNumber;

                    // global.sendSms('9120539945', $text,'300088103373');
                    let ttt = "";
                    if (order.customer && (order.customer.firstName && order.customer.lastName)) {
                        ttt = order.customer.firstName + " " + order.customer.lastName;
                    }

                    // global.sendSms('9147338721', $text,'300088103373');
                    // global.sendSms('9124205049', $text,'300088103373');
                    // global.sendSms('9024252801', $text,'300088103373');
                    let objd = {};
                    let $tz = $text + "\n";
                    // $tz += $text;
                    objd.message = $tz;
// let im='';
//                 console.log('objd', objd);
                    global.publishToTelegram(objd);
                    //
                    // rp(options)
                    //     .then(function (parsedBody) {
                    request(options, function (error, response, parsedBody) {

                        console.log("parsedBody", parsedBody);

                        let obj = {
                            // 'customer': req.headers.customer._id,
                            "amount": amount,
                            "order": req.params._id,
                            Authority: parsedBody["trackId"]
                        };
                        if (req.headers && req.headers.customer && req.headers.customer._id) {
                            obj["customer"] = req.headers.customer._id;
                        }
                        Transaction.create(obj, function (err, transaction) {
                            Order.findByIdAndUpdate(req.params._id, {
                                $push: {
                                    transaction: transaction._id
                                }
                            }, function (order_err, updated_order) {
                                console.log("updated_order", updated_order);
                                console.log("order_err", order_err);
                                if (parsedBody.result == 100) {
                                    // let $text_c = ttt + " عزیز" + "\n" + "سفارش شما دریافت شد و در انتظار پرداخت است، شماره سفارش:" + order.orderNumber + "\n" + "لینک پرداخت:" + "\n" + "https://gateway.zibal.ir/start/" + parsedBody.trackId + "\n" + "آروند، یک گارانتی دوست داشتنی!";
                                    global.sendSms(order.customer.phoneNumber, [{
                                        key: "customer",
                                        value: ttt
                                    }, {key: "orderNumber", value: order.orderNumber}, {
                                        key: "paymentLink",
                                        value: "https://gateway.zibal.ir/start/" + parsedBody.trackId
                                    }], "300088103373", null, "98", "sms_submitOrderNotPaying");

                                    return res.json({
                                        success: true,
                                        url: "https://gateway.zibal.ir/start/" + parsedBody.trackId
                                    });
                                } else {
                                    return res.json({
                                        success: false
                                    });
                                }
                            });
                        });
                    });

                }).populate("customer", "_id phoneNumber firstName lastName");
        }).catch(e => res.json(e))
    },
    update: function (req, res, next) {
        // console.log('update buying...');
        Transaction.findByIdAndUpdate(req.params._id,
            {

                data: req.body.data
            }, {new: true}, function (err, transaction) {
                if (err || !transaction) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }

                res.json({
                    success: true,
                    transaction: transaction
                });

            });

    },
    status: function (req, res, next) {
        return new Promise(function (resolve) {

            Transaction.findOne({Authority: req.query.Authority}, function (
                err,
                transaction
            ) {
                if (err || !transaction) {
                    resolve({
                        success: false,
                        message: "error!",
                        err: err,
                        Authority: req.query.Authority
                    });
                }
                let options = {
                    method: "POST",
                    url:
                        "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",
                    body: {
                        MerchantID: "186704d8-c6c7-49c4-a404-baf16abcb85d",
                        Amount: parseInt(transaction.amount),
                        Authority: req.query.Authority
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                // console.log(options);
                // rp(options)
                //     .then(function (parsedBody) {
                request(options, function (error, response, parsedBody) {

                        // console.log("parsedBody:", parsedBody);
                        if (parsedBody.Status == 100) {
                            Transaction.findByIdAndUpdate(
                                transaction._id,
                                {
                                    RefID: parsedBody.RefID,
                                    statusCode: parsedBody.Status,
                                    updatedAt: new Date()
                                },
                                {new: true},
                                function (err, transaction) {
                                    if (err || !transaction) {
                                        // console.log('rfv', err);
                                        resolve({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                    }
                                    let qc = 0;
                                    let obj = {};
                                    // console.log('orderid', transaction.order);
                                    Order.findByIdAndUpdate(
                                        transaction.order,
                                        {
                                            paymentStatus: "paid",
                                            updatedAt: new Date()
                                        },
                                        {new: true},
                                        function (err, order) {
                                            if (err || !order) {
                                                resolve({
                                                    success: false,
                                                    message: "error!",
                                                    err: err
                                                });
                                            }
                                            // console.log('order', order);
                                            // console.log('order', {
                                            //     order_id: order._id, transaction_id: transaction._id
                                            // });
                                            let sum = order.sum;
                                            let income = (sum * 30) / 100;
                                            let sellerIncome = (sum * 70) / 100;
                                            if (order.agent && order.link) {
                                                Link.findByIdAndUpdate(
                                                    order.link,
                                                    {
                                                        $push: {
                                                            sales: {
                                                                order_id: order._id,
                                                                transaction_id: transaction._id,
                                                                income: income
                                                            }
                                                        },
                                                        $inc: {"income": income}
                                                    },

                                                    function (err, link) {
                                                        if (err || !link) {
                                                            resolve({
                                                                success: false,
                                                                message: "error!",
                                                                err: err
                                                            });
                                                        }
                                                        resolve({
                                                            success: true,
                                                            transaction: transaction,
                                                            order: order,
                                                            link: link
                                                        });
                                                    }
                                                );
                                            } else {
                                                resolve({
                                                    success: true,
                                                    transaction: transaction,
                                                    order: order
                                                });
                                            }
                                        });
                                });
                        }
                        else {
                            Order.findByIdAndUpdate(
                                transaction.order,
                                {
                                    paymentStatus: "unsuccessful",
                                    updatedAt: new Date()
                                },
                                {new: true},
                                function (err, order) {
                                    if (err || !order) {
                                        resolve({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                    }
                                    resolve({
                                        success: false,
                                        err: err,
                                        status: parsedBody.Status
                                    });
                                });

                        }
                        return;
                    }
                )
                    .catch(function (err) {
                        // console.log("err:", err);
                        resolve({
                            success: true,
                            message: "مشکل در  verify"
                        });
                        return;
                    });

            });
        });
    },
    statusD: function (req, res, next) {
        // return new Promise(function (resolve) {
        // console.log("\n\n\n\n\n Srtatus DDDD");
        if (!req.body.Authority) {
            res.json({
                success: false,
                message: "error!",

                Authority: null
            });
            return 0;

        }
        Transaction.findOne({Authority: req.body.Authority}, function (
            err,
            transaction
        ) {
            if (err || !transaction) {
                res.json({
                    success: false,
                    message: "error!",
                    err: err,
                    Authority: req.body.Authority
                });
                return 0;

            }
            // console.log('transaction',transaction);
            if (transaction == null || !transaction.amount) {
                res.json({
                    success: false,
                    message: "error!",
                    amount: null
                });
                return 0;
            }
            let options = {
                method: "POST",
                url:
                    "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",
                body: {
                    MerchantID: "186704d8-c6c7-49c4-a404-baf16abcb85d",
                    Amount: parseInt(transaction.amount),
                    Authority: req.body.Authority
                },
                json: true // Automatically stringifies the body to JSON
            };
            // console.log(options);
            // rp(options)
            //     .then(function (parsedBody) {
            request(options, function (error, response, parsedBody) {

                    console.log("parsedBody:", parsedBody);
                    if (parsedBody.Status == 100) {
                        Transaction.findByIdAndUpdate(
                            transaction._id,
                            {
                                RefID: parsedBody.RefID,
                                statusCode: parsedBody.Status,
                                status: true,
                                updatedAt: new Date()
                            },
                            {new: true},
                            function (err, transaction) {
                                if (err || !transaction) {
                                    // console.log('rfv', err);
                                    res.json({
                                        success: false,
                                        message: "error!",
                                        err: err
                                    });
                                }
                                let qc = 0;
                                let obj = {};
                                // console.log('orderid', transaction.order);
                                Order.findOne({_id: transaction.order}, "agent", function (err, o) {
                                    if (err || !o) {
                                        res.json({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                    }
                                    // console.log('o', o)
                                    let sum = transaction.amount;
                                    let agentIncome = 0;
                                    let sellerIncome = sum;
                                    let ovj = {};


                                    ovj["paymentStatus"] = "paid";
                                    ovj["updatedAt"] = new Date();
                                    // console.log('ovj',ovj);
                                    if (o.agent) {
                                        sellerIncome = (sum * 70) / 100;
                                        if (sellerIncome) {
                                            if (!ovj["$inc"]) {
                                                ovj["$inc"] = {};
                                            }
                                            ovj["$inc"]["sellerIncome"] = sellerIncome;
                                        }
                                        agentIncome = (sum * 30) / 100;
                                        if (agentIncome) {
                                            if (!ovj["$inc"]) {
                                                ovj["$inc"] = {};
                                            }
                                            ovj["$inc"]["agentIncome"] = agentIncome;
                                        }

                                    } else {
                                        sellerIncome = sum;
                                        if (sellerIncome) {
                                            if (!ovj["$inc"]) {
                                                ovj["$inc"] = {};
                                            }
                                            ovj["$inc"]["sellerIncome"] = sellerIncome;
                                        }
                                    }
                                    // console.log('ovj', ovj, o._id);

                                    Order.findByIdAndUpdate(
                                        o._id,
                                        ovj,
                                        {new: true},
                                        function (err, order) {
                                            if (err || !order) {
                                                res.json({
                                                    success: false,
                                                    message: "error!",
                                                    err: err
                                                });
                                            }
                                            // console.log('order', order);

                                            if (order.agent && order.link) {
                                                Link.findByIdAndUpdate(
                                                    order.link,
                                                    {
                                                        $push: {
                                                            sales: {
                                                                order_id: order._id,
                                                                transaction_id: transaction._id,
                                                                income: agentIncome
                                                            }
                                                        },
                                                        $inc: {"income": agentIncome}

                                                    }
                                                    , function (err, link) {
                                                        if (err || !link) {
                                                            res.json({
                                                                success: false,
                                                                message: "error!",
                                                                err: err
                                                            });
                                                        }
                                                        res.json({
                                                            success: true,
                                                            transaction: transaction,
                                                            order: order,
                                                            link: link
                                                        });
                                                    }
                                                );
                                            } else {
                                                res.json({
                                                    success: true,
                                                    transaction: transaction,
                                                    order: order
                                                });
                                            }
                                        });
                                });
                            });
                    }
                    else {
                        Transaction.findByIdAndUpdate(
                            transaction._id,
                            {
                                statusCode: parsedBody.Status,
                                updatedAt: new Date()
                            },
                            function (err, transaction) {
                                if (err || !transaction) {
                                    // console.log('rfv', err);
                                    res.json({
                                        success: false,
                                        message: "error!",
                                        err: err
                                    });
                                    return 0;
                                }

                            });
                        Order.findByIdAndUpdate(
                            transaction.order,
                            {
                                // statusCode: parsedBody.Status,
                                paymentStatus: "unsuccessful",
                                updatedAt: new Date()
                            },
                            {new: true},
                            function (err, order) {
                                if (err || !order) {
                                    res.json({
                                        success: false,
                                        message: "error!",
                                        err: err
                                    });
                                }
                                res.json({
                                    success: false,
                                    err: err,
                                    parsedBody: parsedBody,
                                    status: parsedBody.Status
                                });
                            });

                    }
                    return;
                }
            )
                .catch(function (err) {
                    // console.log("err:", err);
                    res.json({
                        success: true,
                        message: "مشکل در  verify"
                    });
                    return;
                });

        });
        // });
    },
    statusZibal: function (req, res, next) {
        // return new Promise(function (resolve) {
        // console.log("\n\n\n\n\n Srtatus DDDD");
        if (!req.body.Authority) {
            return res.json({
                success: false,
                message: "error!",

                trackId: null
            });
            return 0;

        }
        global.getSetting("ZIBAL_TOKEN").then((merchant) => {

            Transaction.findOne({Authority: req.body.Authority}, function (
                err,
                transaction
            ) {
                if (err || !transaction) {
                    return res.json({
                        success: false,
                        message: "error!",
                        err: err,
                        trackId: req.body.Authority
                    });
                    return 0;

                }
                // console.log('transaction',transaction);
                if (transaction == null || !transaction.amount) {
                    return res.json({
                        success: false,
                        message: "error!",
                        amount: null
                    });
                    return 0;
                }
                let options = {
                    method: "POST",
                    url:
                        "https://gateway.zibal.ir/v1/verify",
                    body: {
                        merchant: merchant,
                        trackId: req.body.Authority
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                // console.log(options);
                // rp(options)
                //     .then(function (parsedBody) {
                request(options, function (error, response, parsedBody) {

                        console.log("gateway.zibal:", parsedBody);

                        if (parsedBody.result == 100) {

                            Transaction.findByIdAndUpdate(
                                transaction._id,
                                {
                                    RefID: parsedBody.refNumber,
                                    statusCode: parsedBody.result,
                                    status: true,
                                    updatedAt: new Date()
                                },
                                {new: true},
                                function (err, transaction) {
                                    if (err || !transaction) {
                                        // console.log('rfv', err);
                                        return res.json({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                    }
                                    let qc = 0;
                                    let obj = {}, ovj = {};
                                    ovj["paymentStatus"] = "paid";
                                    ovj["updatedAt"] = new Date();

                                    // console.log('ovj', ovj, o._id);

                                    Order.findByIdAndUpdate(
                                        transaction.order,
                                        ovj,
                                        {new: true},
                                        function (err, order) {
                                            if (err || !order) {
                                                return res.json({
                                                    success: false,
                                                    message: "error!",
                                                    err: err
                                                });
                                            }
                                            console.log('order', order);
                                            let $text = "";
                                            if (order) {
                                                $text = "customer payed: " + order.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Toman" + "\n" + "order number: # " + order.orderNumber + "\n" + CONFIG.ADMIN_URL + "/#/order/" + order._id + "\n";
                                                $text += "customer phone number: " + order.customer.phoneNumber;
                                            }
                                            // global.sendSms('9120539945', $text,'300088103373');
                                            let ttt = "";
                                            if (order && order.customer && (order.customer.firstName && order.customer.lastName)) {
                                                ttt = order.customer.firstName + " " + order.customer.lastName;
                                            }

                                            // global.sendSms("9024252801", $text, "300088103373");
                                            let objd = {};
                                            let $tz = $text + "\n";
                                            objd.message = $tz;


                                            //let $text_c = ttt + " عزیز" + "\n" + "سفارش شما با موفقیت ثبت شد و در دست بررسی است، شماره سفارش:" + order.orderNumber + "\n" + "لینک سفارشات:" + "\n" + "http://localhost:3001/my-account/" + "\n" + "آروند، یک گارانتی دوست داشتنی!";
                                            if (order)
                                                global.sendSms(order.customer.phoneNumber, [
                                                    {
                                                        key: "customer",
                                                        value: ttt
                                                    },
                                                    {
                                                        key: "orderNumber",
                                                        value: order.orderNumber
                                                    },
                                                    {
                                                        key: "myOrdersLink",
                                                        value: CONFIG.SHOP_URL + "/my-account/"
                                                    }], "300088103373", null, "98", "sms_submitOrderSuccessPaying");

                                            global.publishToTelegram(objd);

                                            // console.log('order.deliveryDay', order.deliveryDay);
                                            if (order.deliveryDay && order.deliveryDay.theid == "chapar") {
                                                let sumTitles = "", theTotal = 0;
                                                order.package.map((car) => {
                                                    sumTitles += car.product_name + " ,";
                                                    theTotal += car.total_price;
                                                });
                                                let ddd = new Date();

                                                let string = "{\"user\": {\"username\": \"" + process.env.CHAPAR_USERNAME + "\",\"password\": \"" + process.env.CHAPAR_USERNAME + "\"},\"bulk\": [{\"cn\": {\"reference\": " + order.orderNumber + ",\"date\": \"" + ddd.getUTCFullYear() + "-" + ddd.getMonth() + "-" + ddd.getUTCDate() + "\",\"assinged_pieces\": \"" + order.card.length + "\",\"service\": \"1\",\"value\": \"" + theTotal + "\",\"payment_term\": 0,\"weight\": \"1\",\"content\":\"" + sumTitles + "\",\"change_state_url\":\"\"},\"sender\": {\"person\": \"حسین محمدی\",\"company\": \"شرکت گارانتی آروند\",\"city_no\": \"10866\",\"telephone\": \"+982142528000\",\"mobile\": \"989024252802\",\"email\": \"info@localhost:3001\",\"address\": \"تهران، کاووسیه، بلوار میرداماد، پلاک ۴۹۶، مجتمع پایتخت، بلوک A، طبقه ۹، واحد ۹۰۱\",\"postcode\": \"1969763743\"},\"receiver\": {\"person\": \"" + (order.customer.firstName + " " + order.customer.lastName) + "\",\"company\": \"\",\"city_no\": \"" + order.billingAddress.City_no + "\",\"telephone\": \"" + order.billingAddress.PhoneNumber + "\",\"mobile\": \"" + order.customer.phoneNumber + "\",\"email\": \"test@test.com\",\"address\": \"" + (order.billingAddress.State + " " + order.billingAddress.City + " " + order.billingAddress.StreetAddress) + "\",\"postcode\": \"" + order.billingAddress.PostalCode + "\"}}]}";

                                                var options = {
                                                    method: "POST",
                                                    url: "https://app.krch.ir/v1/bulk_import",
                                                    headers: {"content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"},
                                                    //   formData: {input: '{\n\t"user": {\n\t\t"username": "vira.tejarat",\n\t\t"password": "42528000"\n\t},\n\t"bulk": [{\n\t\t"cn": {\n\t\t\t"reference": '+order.orderNumber+',\n\t\t\t"date": "'+new Date()+'",\n\t\t\t"assinged_pieces": "'+order.card.length+'",\n\t\t\t"service": "1",\n\t\t\t"value": "'+theTotal+'",\n\t\t\t"payment_term": 0,\n\t\t\t"weight": "1",\n                       "content":"'+sumTitles+'",\n                       "change_state_url":"'+"http://localhost:3001/customer/order/peyk/" + order._id+'"\n\t\t},\n\t\t"sender": {\n\t\t\t"person": "حسین محمدی",\n\t\t\t"company": "شرکت گارانتی آروند",\n\t\t\t"city_no": "10866",\n\t\t\t"telephone": "+982142528000",\n\t\t\t"mobile": "989024252802",\n\t\t\t"email": "info@localhost:3001",\n\t\t\t"address": "تهران، کاووسیه، بلوار میرداماد، پلاک ۴۹۶، مجتمع پایتخت، بلوک A، طبقه ۹، واحد ۹۰۱",\n\t\t\t"postcode": "1969763743"\n\t\t},\n\t\t"receiver": {\n\t\t\t"person": "'+(order.customer.firstName + ' ' + order.customer.lastName)+'",\n\t\t\t"company": "",\n\t\t\t"city_no": "'+order.billingAddress.City_no+'",\n\t\t\t"telephone": "'+order.billingAddress.PhoneNumber+'",\n\t\t\t"mobile": "'+order.customer.phoneNumber+'",\n\t\t\t"email": "test@test.com",\n\t\t\t"address": "'+(order.billingAddress.State + ' ' + order.billingAddress.City + ' ' + order.billingAddress.StreetAddress)+'",\n\t\t\t"postcode": "'+order.billingAddress.PostalCode+'"\n\t\t}\n\t}]\n}'}
                                                    formData: {input: string}
                                                };

                                                request(options, function (error, response, body) {
                                                    if (error) throw new Error(error);
                                                    console.log("chaparBody:", body);
                                                    if (body && body.result && body.objects && body.objects.result && body.objects.result[0]) {

                                                    }

                                                    // res.json(body);
                                                });

                                            }
                                            return res.json({
                                                success: true,
                                                transaction: transaction,
                                                order: order
                                            });

                                        }).populate("customer", "_id firstName lastName phoneNumber");
                                });
                        }
                        else {
                            Transaction.findByIdAndUpdate(
                                transaction._id,
                                {
                                    statusCode: req.body.Status,
                                    status: (req.body.Status == 1 || req.body.Status == 2) ? true : false,
                                    updatedAt: new Date()
                                },
                                function (err, transaction) {
                                    if (err || !transaction) {
                                        // console.log('rfv', err);
                                        return res.json({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                        return 0;
                                    }

                                });
                            Order.findByIdAndUpdate(
                                transaction.order,
                                {
                                    // statusCode: parsedBody.Status,
                                    paymentStatus: "unsuccessful",
                                    updatedAt: new Date()
                                },
                                {new: true},
                                function (err, order) {
                                    if (err || !order) {
                                        return res.json({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                    }
                                    return res.json({
                                        success: false,
                                        err: err,
                                        parsedBody: parsedBody,
                                        status: req.body.status,
                                        "transaction.order": transaction.order,
                                        "transaction._id": transaction._id,
                                        "parsedBody.success": req.body.Status

                                    });
                                });

                        }
                        return;
                    }
                )
                    .catch(function (err) {
                        // console.log("err:", err);
                        res.json({
                            success: true,
                            message: "مشکل در  verify"
                        });
                        return;
                    });

            });
        });
    },

    verify: function (req, res, next) {
        Transaction.findOne({Authority: req.params.bank_token}, function (
            err,
            transaction
        ) {

            if (err || !transaction) {
                res.json({
                    success: false,
                    message: "error!",
                    err: err,
                    Authority: req.body.token
                });
                return;
            }

            Transaction.findByIdAndUpdate(
                transaction._id,
                {
                    RefID: req.body.RefNo,
                    statusCode: req.body.ResCod,
                    updatedAt: new Date()
                },
                {new: true},
                function (err, transaction) {
                    if (err || !transaction) {
                        res.json({
                            success: false,
                            message: "error!",
                            err: err
                        });
                    }
                    let qc = 0;
                    let obj = {};

                    if (transaction.order_obj) {
                        if (transaction.order_obj.questionCount) {
                            qc = transaction.order_obj.questionCount;
                        }
                        if (
                            transaction.order_obj.goldScore ||
                            transaction.order_obj.silverScore
                        ) {
                            obj = transaction.order_obj;
                        }
                    }
                    Customer.findByIdAndUpdate(
                        transaction.customer_obj._id,
                        {
                            $inc: {question_credit: +qc},
                            $push: {pocket: obj},
                            updatedAt: new Date()
                        },
                        {new: true},
                        function (err, customer) {
                            if (err || !customer) {
                                res.json({
                                    success: false,
                                    err: err,
                                    message: "user updated wrong"
                                });
                                return;
                            }
                            tttl = "پرداخت موفق";
                            tttx = "پکیج به حساب شما اضافه شد.";

                            res.json({
                                success: true,
                                RefID: req.body.RefNo,
                                transaction: transaction._id,
                                Status: req.body.ResCod,
                                customer_obj: transaction.customer_obj,
                                order_obj: transaction.order_obj
                            });

                        }
                    );
                }
            );
        });
    }
});
export default self;
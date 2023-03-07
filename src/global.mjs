// console.log('#global')
import mongoose from "mongoose"
import request from "#root/request";
// const rp from 'request';
// const randtoken from 'rand-token';
// import User from "#models/user";
// import Settings from "#models/settings";
var Settings = {};
var User = {};
// import Sms from "#controllers/sms";
// import Action from "#controllers/action";
// import Customer from "#models/customer";
// import VARIABLE from "#v/variables";
// import config from "#json/variables/config";
var config = {
    "setting": {
        "logo": "",
        "title": "",
        "siteName": "",
        "separator": "|",
        "FRONT_ROUTE": "",
        "SHOP_URL": "",
        "BASE_URL": "",
        "primaryColor": "",
        "secondaryColor": ""
    }
}
// import randtoken from "rand-token";

let version = process.env.VERSION_NUM;
export const isSSR = typeof window === "undefined";

let global = {
    body: "",
    ip: process.env.BASE_URL,
    domain: process.env.BASE_URL,
    config: (setting) => (config),
    getTypeOfVariable: (variable) => {
        // console.log('variable',variable);
        return typeof variable;
    },
    models: [],
    fireEvent: (event, params = {},props={}, req = null, res = null, next = null) => {
        console.log('Fire events...')
        let functions = [];
        props.entity.forEach((en, d) => {
            if (en.functions) {
                en.functions.forEach((fn) => {
                    console.log('fn', fn)
                    functions.push(fn);
                });
            }
            if (en.hook) {
                en.hook.forEach((hook) => {
                    if (hook.event == event) {
                        console.log('run event ...', hook.name)
                        if (req && res && next)
                            hook.func(req, res, next, params);
                    }
                });
            }
        })
        let Automation = mongoose.model('Automation');
        Automation.find({trigger: event}, function (err, automations) {
            if (err || !automations) {
                console.log('return...')
                return;
            }
            if (automations) {
                automations.forEach((item, i) => {
                    if (item && item.functions) {

                        item.functions.forEach((func, j) => {
                            functions.forEach((call) => {
                                // if(call==func.name)
                            })
                        })
                    }
                })
            }

        });
    },
    resetSystem: () => {
        request({
                method: "post",
                url: "http://rest.payamak-panel.com/api/SendSMS/SendSMS",
                data: {
                    username: process.env.SMS_USERNAME,
                }
            },
            (error, response, parsedBody) => {
            }).catch(function (err) {
        });
    },
    CONFIG: {
        BASE_URL: process.env.BASE_URL,
        SHOP_URL: process.env.SHOP_URL,
        THEME_URL: process.env.THEME_URL,
        FRONT_ROUTE: process.env.BASE_URL + "/customer",
        setting: {
            separator: "|",
            siteName: process.env.SITE_NAME

        }
    },
    getSetting: (name) => {
        return new Promise(function (resolve, reject) {
            let Settings = mongoose.model('Settings');

            Settings.findOne({}, name, function (err, setting) {
                if (err || !setting) {
                    return reject(err);

                }
                console.log('getSetting', setting[name])
                if (setting[name])
                    return resolve(setting[name]);
                else
                    reject({});
            });
        });
    },
    sendSms: function (to, text, From = "50004000004", customerId = null, countryCode = "98", findKey = false) {
        return new Promise(function (resolve, reject) {
            // return;
            to = to.toString();
            if (to.length < 12) {
                // console.log('to: ', to.toString(), to.toString().length);
                if (to.toString().length === 10) {
                    to = "98" + to.toString();
                }
            }
            console.log("countryCode", countryCode);
            if (findKey) {
                let Settings = mongoose.model('Settings');

                Settings.find({},
                    function (err, setting) {
                        if (setting && setting[setting.length - 1]) {
                            let smstext = setting[setting.length - 1];
                            smstext = smstext[findKey];
                            if (typeof text == "object") {

                                text.forEach((tt) => {
                                    // const reg = /((\%(.*)\%)|(%(.*)%))/;
                                    console.log("%" + tt.key + "%");
                                    smstext = smstext.replace("%" + tt.key + "%", tt.value);
                                });

                            }
                            global.sendmessage(countryCode, "50001060009809", to, smstext, resolve, reject);

                        }
                    }
                );
            } else {
                // 300088103373
                //50001060009809
                global.sendmessage(countryCode, "50001060009809", to, text, resolve, reject);
            }


        });

    },
    sendmessage: function (countryCode = "98", From = "300088103373", to, text, resolve, reject) {
        if (countryCode === "98") {
            // From = '50004000004';
            console.log("\n\n\n\n\n\nsend sms for Iran\n");
            console.log("process.env.SMS_USERNAME:", process.env.SMS_USERNAME);
            console.log("process.env.SMS_PASSWORD:", process.env.SMS_PASSWORD);
            console.log("to:", to);
            console.log("From", From);
            console.log("text", text);
            console.log("\n\n\n\n\n");
            let Notification = mongoose.model('Notification');

            Notification.create({
                message: text,
                phoneNumber: to,
                from: From
            }).then((sms) => {
                // console.log("sss", sms);


                let options = {
                    method: "post",
                    url: "http://rest.payamak-panel.com/api/SendSMS/SendSMS",
                    data: {
                        username: process.env.SMS_USERNAME,
                        password: process.env.SMS_PASSWORD,
                        from: From,
                        //  from: '300088103373',

                        to: to,
                        isflash: "false",
                        text: text
                    },
                    // json: true // Automatically stringifies the body to JSON
                };

                // rp(options)
                //     .then(function (parsedBody) {
                request(options,
                    function (error, response, parsedBody) {

                        console.log("parsedBody of sending sms to melli payamak:", parsedBody, to, text);
                        console.log("melli payamak:", parsedBody.StrRetStatus, parsedBody.RetStatus);
                        if (parsedBody.StrRetStatus == "Ok" && parsedBody.RetStatus == 1) {
                            // Notification.editByAdmin(sms._id, {status: "sent"});

                        }
                        return resolve({
                            success: true,
                            message: "کد برای شما ارسال شد!"
                        });
                    }).catch(function (err) {
                    console.log("err global sms:", err);
                    return reject({
                        success: true,
                        err: err,
                        message: "مشکل در ارسال اس ام اس!"
                    });
                });
            });

        } else {
            reject({});
        }
    },
    publishToTelegram: function (obj, chname = "channelname") {
        return new Promise(function (resolve, reject) {
            let u = encodeURI("https://idehweb.com/telegram/index.php");
            // if (chname != "arvandguarantee_shop") {
            //   u += "?chname=@" + chname;
            // }
            let options = {
                method: "POST",
                url: u,
                body: obj,
                json: true // Automatically stringifies the body to JSON
            };
            // console.log('d')
            // rp(options)
            //     .then(function (parsedBody) {
            request(options, function (error, response, parsedBody) {

                // console.log('parsedBody:', parsedBody, obj);
                resolve({
                    success: true
                    // body:parsedBody
                });
            })
                .catch(function (err) {
                    // console.log('err:', err);
                    reject({
                        success: false
                    });
                });


        });

    },

    notifateToTelegram: function (obj) {
        return new Promise(function (resolve, reject) {
            //     // obj.message += "\n\n\n" + "ثبت آگهی رایگان در زومی روم..." + "\n" + "@zmnotifications" + "\n" + "https://zoomiroom.com"
            //     let u = encodeURI('https://arvandguarantee.com/telegram/index.php?chname=@zmnotifications');
            //     let options = {
            //         method: 'POST',
            //         uri: u,
            //         body: obj,
            //         json: true // Automatically stringifies the body to JSON
            //     };
            //     console.log('d')
            //     rp(options)
            //         .then(function (parsedBody) {
            //             console.log('parsedBody:', parsedBody, obj);
            resolve({
                success: true
                // body:parsedBody
            });
            //         })
            //         .catch(function (err) {
            //             console.log('err:', err);
            //             reject({
            //                 success: false
            //             });
            //         });
            //
            //
        });

    },
    sendNotif: function (title, body, pg) {
        return new Promise(function (resolve, reject) {
            let options = {
                method: "POST",
                url: "https://fcm.googleapis.com/fcm/send",
                body: {
                    "notification": {
                        "title": title,
                        "body": body,
                        "click_action": "",
                        "icon": ""
                    },
                    "priority": "high",
                    "to": "/topics/all"
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": ""
                },
                json: true // Automatically stringifies the body to JSON
            };

            // rp(options)
            //     .then(function (parsedBody) {
            request(options, function (error, response, parsedBody) {

                // console.log('parsedBody:', parsedBody, title, body);
                resolve({
                    success: true,
                    message: "نوتیف شما ارسال شد!",
                    parsedBody: parsedBody
                });
            })
                .catch(function (err) {
                    //  console.log('err:', err);
                    reject({
                        success: true,
                        message: "مشکل در ارسال نوتیف!"
                    });
                });

        });

    },
    generateUnid: function (arr, userIp) {

        let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
        var token = "";
        for (let i = 0; i < 32; i++) {
            token += abc[Math.floor(Math.random() * abc.length)];
        }
        // console.log('token is',token);
        return token; //Will return a 32 bit "hash"

        // return randtoken.generate(32);

    },

    addUnic: async function (arr, userIp) {
        return await new Promise(async function (resolve, reject) {


            const {length} = await arr;
            // console.log('arr.length', length);
            // console.log('userIp', userIp);
            const id = await (length + 1);
            const found = await arr.some(el => el.userIp === userIp);
            // console.log('found', found);
            if (!found) {
                await arr.push({userIp: userIp, createdAt: new Date()});
            }
            ;
            await resolve(arr);
        });
    },
    checkSiteStatus: function () {
        return new Promise(function (resolve, reject) {
            let Settings = mongoose.model('Settings');

            Settings.find({}, {
                    activeCategory: 1,
                    siteActive: 1,
                    siteActiveMessage: 1
                },
                function (err, setting) {
                    setting = setting[0];
                    if (err || !setting || setting == null) {
                        // console.log('==> authenticateAdmin() got error');
                        reject({
                            success: false,
                            message: "something wrong!"
                        });
                    }
                    // console.log('setting', setting);
                    // activeCategory
                    // console.log('activeCategory', setting.activeCategory);
                    if (setting && setting.siteActive) {
                        resolve({
                            success: true,
                            activeCategory: setting.activeCategory
                        });
                    } else if (setting && setting.siteActiveMessage && setting.activeCategory) {
                        reject({
                            success: false,
                            message: setting.siteActiveMessage || "",
                            activeCategory: setting.activeCategory
                        });

                    } else {
                        reject({
                            success: false
                        });

                    }


                }
            );

        });


    },
    checkAdminAuthentication: function (token) {
        return new Promise(function (resolve, reject) {

            User.findOne(
                {
                    "token": token
                }, "username , _id , active",
                function (err, post) {
                    if (err) {
                        // console.log('==> authenticateAdmin() got error');
                        reject(err);
                    } else {
                        // console.log('==> authenticateAdmin() got response ');
                        if (post) {

                            resolve({
                                success: true,
                                message: "Admin has access!",
                                user: post
                            });

                        } else {
                            reject({success: false, status: 401, message: "Admin does not exist!"});
                        }
                    }
                }
            );

        });

        // return new Promise(function (resolve, reject) {
        //     if (!session_userId) {
        //         reject(false);
        //     }
        //     Admin.findById(session_userId)
        //         .exec(function (error, user) {
        //             if (error) {
        //                 reject(false);
        //             } else {
        //                 // console.log(user);
        //                 if (user)
        //                     resolve({success: true, user: {username: user.username, role: user.type,token:user.token}});
        //                 else
        //                     reject(false);
        //             }
        //         });
        //
        // });
    },
    checkCustomerAuthentication: function (token) {
        return new Promise(function (resolve, reject) {
            Customer.findOne(
                {
                    "tokens.token": token
                },
                function (err, customer) {
                    if (err || !customer) {
                        // console.log('==> authenticateCustomer() got error');
                        reject(err);
                    }
                    // else {
                    // console.log('version:',version);
                    // if (customer) {

                    resolve({
                        success: true,
                        message: "Customer has access!",
                        customer: customer
                    });

                    // } else {
                    //     reject({success: false, status: 401, message: 'Customer does not exist!'});
                    // }
                    // }
                }
            );

        });

    },
    asyncForEach: async function (array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    },
    check: function (s) {
        let PersianOrASCII = /[آ-ی]|([a-zA-Z])/;
        if ((m = s.match(PersianOrASCII)) !== null) {
            if (m[1]) {
                return false;
            } else {
                return true;
            }
        }
        else {
            return true;
        }
    },
    city: function (s) {
        let x = "";
        switch (s) {
            case 1:
                x = "آذربایجان شرقی";
                break;
            case 2:
                x = "آذربایجان غربی";
                break;
            case 3:
                x = "اردبیل";
                break;
            case 4:
                x = "اصفهان";
                break;
            case 5:
                x = "ایلام";
                break;
            case 6:
                x = "بوشهر";
                break;
            case 7:
                x = "تهران";
                break;
            case 8:
                x = "چهارمحال و بختیاری";
                break;
            case 9:
                x = "خراسان جنوبی";
                break;
            case 10:
                x = "خراسان رضوی";
                break;
            case 11:
                x = "خراسان شمالی";
                break;
            case 12:
                x = "خوزستان";
                break;
            case 13:
                x = "زنجان";
                break;
            case 14:
                x = "سمنان";
                break;
            case 15:
                x = "سیستان و بلوچستان";
                break;
            case 16:
                x = "فارس";
                break;
            case 17:
                x = "قزوین";
                break;
            case 18:
                x = "قم";
                break;
            case 19:
                x = "کردستان";
                break;
            case 20:
                x = "کرمان";
                break;
            case 21:
                x = "کرمانشاه";
                break;
            case 22:
                x = "البرز";
                break;
            case 23:
                x = "گلستان";
                break;
            case 24:
                x = "گیلان";
                break;
            case 25:
                x = "لرستان";
                break;
            case 26:
                x = "مازندران";
                break;
            case 27:
                x = "مرکزی";
                break;
            case 28:
                x = "هرمزگان";
                break;
            case 29:
                x = "همدان";
                break;
            case 30:
                x = "یزد";
                break;
            case 31:
                x = "کهگیلویه و بویراحمد";
                break;


        }
        return x;
    },
    getFormattedTime: function () {
        let today = new Date();
        let y = today.getFullYear();
        let mo = today.getMonth();
        let d = today.getDate();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        return y + "-" + mo + "-" + d + "-" + h + "-" + m + "-" + s;
    },
    authenticateCustomer: function (_id, token) {
        // console.log('==> authenticateCustomer ()');
        return new Promise(function (resolve, reject) {
            Customer.findOne(
                {
                    _id: _id,
                    "tokens.token": token
                },
                function (err, post) {
                    if (err) {
                        // console.log('==> authenticateCustomer() got error');
                        reject(err);
                    } else {
                        // console.log('==> authenticateCustomer() got response ');
                        if (post) {

                            resolve({
                                success: true,
                                message: "Customer has access!",
                                user_id: post._id,
                                _id: post._id
                            });

                        } else {
                            reject({success: false, status: 401, message: "Customer does not exist!"});
                        }
                    }
                }
            );

        });
    },
    // Promise:global.Promise

};

export default global;
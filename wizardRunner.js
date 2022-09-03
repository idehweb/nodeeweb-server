console.log('#wizard');
const logger = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    silent: process.env.NODE_ENV === 'production',
    path: path.join(__dirname, './', `.env`),
});
// const busboy = require( "connect-busboy");
// const cookieParser = require( "cookie-parser");
const {MongoClient} = require("mongodb");
// console.log("#f main/src/bin/installer.js");
const fs = require("fs");
const http = require("http");
const config = require("./src/variables/config.json");
const bcrypt = require("bcrypt");
const Wizard = require("wizard");


const express = require("express");
let app = express();
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
let port = normalizePort(process.env.SERVER_PORT);
app.set("port", port);
let server = http.createServer(app);
// const router = express.Router();
const viewsFolder = path.join(__dirname, "views");
// console.log("__dirname", __dirname, viewsFolder);
app.disable("x-powered-by");
app.use(logger("dev"));

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(busboy());
app.set("view engine", "pug");

app.set("views", viewsFolder);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// const global =  require("../global.mjs");
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    let bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    console.log("Listening on " + bind);
    // setter();
}

app.get("/", (req, res, next) => {
    let json = getter();

    console.log("*** GET", json);
    res.render("wizard", json);
});
app.post("/", (req, res, next) => {
    console.log("*** POST");
    setter(req.body, res);
});

function setter(obj, res = false) {
    if (!obj)
        obj = {};
    console.log("==>() create config.js ", obj);

    // if(req && req.body){
    //   obj=req.body;
    // }
// return;
    Wizard.updateImportantFiles(obj);
    let json = getter();


    const private_obj = obj;
    if (private_obj.ADMIN_USERNAME &&
        private_obj.ADMIN_PASSWORD) {
        // MongoClient.
        MongoClient.connect(private_obj.mongodbConnectionUrl,
            {useNewUrlParser: true},
            function (err, client) {
                if (!err) {
                    // console.log("db", private_obj);
                    console.log("We are connected to mongo:", private_obj.dbName);
                    bcrypt.hash(private_obj.ADMIN_PASSWORD, 10, function (err, hash) {
                        if (err) {
                            console.log("error hash pass...");
                        }
                        let db = client.db(private_obj.dbName);
                        const collection = db.collection('users');
                        let password = hash;
                        // db.collection("user", function(err, collection) {


                        let userData = {};
                        userData.type = "user";
                        userData.token = Wizard.generateUnid();
                        collection.insertOne({
                            email: private_obj.ADMIN_USERNAME + "@" + private_obj.ADMIN_USERNAME + ".com",
                            username: private_obj.ADMIN_USERNAME,
                            nickname: private_obj.ADMIN_USERNAME,
                            password: password,
                            token: userData.token,
                            type: userData.type,
                        }, function (error, user) {
                            if (error) {

                                console.log("error creating user...");
                            }
                            // return res.render('wizard', obj);
                            res.send("done! start from running 'yarn server'");
                            process.exit();
                        });


                    });
                    // });/

                } else {
                    console.log("we can not connect to db:", private_obj.dbName);
                }

            });
    }
}

function getter() {
    return {
        "dbName": process.env.dbName,
        "SERVER_PORT": process.env.SERVER_PORT,
        "CLIENT_PORT": process.env.CLIENT_PORT,
        "SITE_NAME": process.env.SITE_NAME,
        "BASE_URL": process.env.BASE_URL,
        "FRONT_ROUTE": process.env.BASE_URL + "/customer",
        "ADMIN_ROUTE": process.env.BASE_URL + "/admin",
        "ADMIN_URL": process.env.ADMIN_URL,
        "SHOP_URL": process.env.BASE_URL + '/',
        "ADMIN_EMAIL": process.env.ADMIN_EMAIL,
        "ADMIN_USERNAME": process.env.ADMIN_USERNAME,
        "ADMIN_PASSWORD": process.env.ADMIN_PASSWORD,
        "SMS_USERNAME": process.env.SMS_USERNAME,
        "SMS_PASSWORD": process.env.SMS_PASSWORD,
        "CHAPAR_USERNAME": process.env.CHAPAR_USERNAME,
        "CHAPAR_PASSWORD": process.env.CHAPAR_PASSWORD,
        "NODE_ENV": process.env.NODE_ENV,
        "RESET": false,
    };

    // if(req && req.body){
    //   obj=req.body;
    // }
    // if (obj.ADMIN_URL)
    //   delete obj.ADMIN_URL;
    // let writedata = config;
    // // console.log(writedata)
    // writedata = ({ ...writedata, ...obj, "FRONT_ROUTE": obj.FRONT_ROUTE });
    // if (obj.BASE_URL)
    //   writedata["BASE_URL"] = obj.BASE_URL + "/customer";
    // // const writedata = global.config({ ...obj, FRONT_ROUTE: obj.BASE_URL + "/customer" });
    // let configPath = path.join(__dirname, "../../public_media/site_setting/", "config.js");
    // try {
    //   // try to read file
    //   console.log("try to read file==>");
    //   return fs.promises.configPath("configPath");
    // } catch (error) {
    //   // create empty file, because it wasn't found
    // }


}

// });
//   console.log(Wizard.isItInstalled().then(x => {
//     console.log("done...");
//   }));

// }
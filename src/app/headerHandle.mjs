// console.log("#f headerHandle");

import path from "path";
// import commonDir from 'commondir';
// import {packageDirectory} from 'pkg-dir';
// import {pkgUp} from 'pkg-up';
// import fs from 'fs'
// import {fileURLToPath} from 'url';
// console.log( pack/ageDirectory());
// import isbot from "isbot";
// import ERV from "express-react-views";
// import app from "./index";

// console.log('__dirname',process);
// const appDirectory = fs.realpathSync('./');
// const resolveApp = relativePath => {
//   console.log('relativePath')
// };
// console.log('appDirectory',appDirectory)
// console.log('relativePath',relativePath)
// console.log('resolveApp',resolveApp('/'))
const __dirname = path.resolve();
// console.log('__dirname',process.env.SERVER_PORT);
// console.log('__dirname2', __dirname);


// console.log('__dirn',path.resolve(path.join(__dirname, "../views")));
const viewsFolder = __dirname;



const headerHandle = (app) => {


  app.use(function(req, res, next) {
      // pkgUp().then(e=>{
      //   console.log('eeee',e)
      //     // process.exit();
      //
      // })
    // let ua = req.get("user-agent");
    // app.set('views', viewsFolder);
    // app.set('view engine', 'jsx');
    // app.engine('jsx', ERV.createEngine());
    // if (isbot(ua)) {
    //   console.log("BOT => ", ua);
      // app.set("views", viewsFolder + "/bot");
    // } else {
      // app.set("views", viewsFolder);
      // app.set("views", viewsFolder);

    // }
    // app.set("views", viewsFolder);

    // next();
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,response, Authorization, Content-Length, X-Requested-With, shared_key, token , _id , lan , fields"
    );

    res.setHeader(
      "Access-Control-Expose-Headers",
      "X-Total-Count"
    );
    // res.setHeader(
    //   "Content-Type",
    //   "application/javascript"
    // );

    if (!req.headers.lan) {
      // let lngs = req.acceptsLanguages();
      // if (lngs.includes('ar')) {
      //   req.headers.lan = 'ar';
      // } else if (lngs.includes('tu')) {
      //   req.headers.lan = 'tu';
      // } else if (lngs.includes('fa')) {
      //   req.headers.lan = 'fa';
      // } else if (lngs.includes('en')) {
      //   req.headers.lan = 'en';
      // } else {
      req.headers.lan = "fa";
      // }
    }
    res.setHeader(
      "Content-Language",
      // 'en , fa , ar , tr'
      "fa"
    );

    //intercepts OPTIONS method
    if ("OPTIONS" === req.method) {
      //respond with 200
      return res.sendStatus(200);
    } else {
      //move on
      next();
    }

    // Pass to next layer of middleware
    //  next();
  });
};
export default headerHandle;
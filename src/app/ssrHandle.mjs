console.log("#f ssrHandle");

import path from "path";
import isbot from "isbot";
// import app from "./index";
import fs from "fs";
import "ignore-styles";
import * as ReactDOMServer from "react-dom/server";
import * as React from "react";
import { StaticRouter } from "react-router-dom/server";
import { matchPath } from "react-router-dom";
import AppSSR from "#c/AppSSR";
import routes from "#c/ssrRoutes";

import { Provider } from "react-redux";

import { persistor, store } from "#c/functions/store";
import config from "#c/config";
import {the_public_route} from "#routes/public/p";

// const __dirname = path.resolve();
// const viewsFolder = path.join(__dirname, "./views");


const ssrHandle = (app) => {
  const vars=config;
  // const tars=JSON.parse(vars);
  // console.log("tars",vars);
  if (vars.BASE_URL) {
    console.log("base url found");
    app.get("/", (req, res, next) => {
      console.log("the /");
      ssrParse(req, res, next);

    });
    app.get("/p/:_id/:title", (req, res, next) => {
      console.log("/p/:_id/:title");
      ssrParse(req, res, next);
    });

    app.get("/post/:_id/:title", (req, res, next) => {
      console.log("/post/:_id/:title");

      ssrParse(req, res, next);
    });

    app.get("/page/:_id/:title", (req, res, next) => {
      console.log("/page/:_id/:title");

      ssrParse(req, res, next);
    });
    app.get("/:_firstCategory/:_id", (req, res, next) => {
      console.log("/:_firstCategory/:_id");
      ssrParse(req, res, next);
    });
  } else {
    console.log("base url NOT found, we should go through wizard...");

    app.get("/", (req, res, next) => {
      return res.json({"error":"app is not installed!"});
    });
  }
};
const ssrParse = (req, res, next) => {
  let ua = req.get("user-agent");
  if (!req.headers.lan)
    req.headers.lan = "fa";
  console.log("==> () ssrParse");

  if (isbot(ua)) {
    console.log("it is bot, we need SSR...");

    console.log("BOT => ", ua);
    fs.readFile(path.resolve("./build/index.html"), "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred");
      }
      const context = {};
      let cccc = [];
      const dataRequirements =
        routes
          .filter(route => {
            return (matchPath(route, req.url));
          })
          .map(route => {
            if (req.params._firstCategory && req.params._id) {
              route.server[0].params = req.params._id;
            }
            return route;
          })
          .filter(comp => {
            return comp.server;
          })
          .map(comp => {
            console.log("typeof comp.server", typeof comp.server);
            if (typeof comp.server === "object") {
              comp.server.forEach(s => {
                console.log("s.params", s.params);
                cccc.push(store.dispatch(s.func(s.params)));
              });
              return cccc;
            } else {
              cccc.push(store.dispatch(comp.server(comp.params)));
              return store.dispatch(comp.server(comp.params));

            }
            // return store.dispatch(comp.server(comp.parameter))
          }); // dispatch data requirement
      console.log("dataRequirements", cccc);
      Promise.all(cccc).then(() => {
        const renderedData = ReactDOMServer.renderToString(<Provider store={store}>
          <StaticRouter context={context} location={req.url}>
            <AppSSR url={req.url}/></StaticRouter></Provider>);
        console.log("res.send ==============>");
        res.locals.renderedData = renderedData;
        res.locals.body = data.replace(
          "<div id=\"root\"></div>",
          `<div id="root">${renderedData}</div>`
        );
        // return the_public_route(req,res,next);
        // res.locals.body=data;
        // console.log("res.locals.body",res.locals.body);
        // req.headers.htmlSend='xxxs';
        // console.log('req',req);
        // return res.json(req);
        next();
          // return res.send(
          //   res.locals.body
        // );
      });
    });
  }
  else {
    console.log("no need to ssr...");
    next();
  }
};
export default ssrHandle;
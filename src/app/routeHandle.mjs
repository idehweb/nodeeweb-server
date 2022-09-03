console.log("#f routeHandle");
// import path from "path";
// const __dirname = path.resolve();
// const publicFolder = path.join(__dirname, "./public");

// import AdminRT from "#routes/admin/index";
import {createPublicRoute, createRoute, returnDefaultModels} from "#routes/index";

// const router = express.Router();

// import BoyRT from "#routes/boy/index";
// import {the_public_route} from "#routes/public/p";

// createDefaultRoute();
let routeHandle = (app, props = {}) => {
    console.log("==> routeHandle(app,props)");

    // if (config().set///////ting.BASE_URL) {

    // res.status(200);
    // let keys = Object.keys(CustomerRT);
    // keys.forEach((x) => {
    //   app.use("/boy/" + x, BoyRT[x]);
    // });
    // keys = Object.keys(AdminRT);
    // keys.forEach((x) => {
    //   app.use("/admin/" + x, AdminRT[x]);
    // });
    // keys = Object.keys(CustomerRT);
    // keys.forEach((x) => {
    //     console.log('/admin/'+x)
    //
    //     app.use("/admin/" + x, CustomerRT[x]);
    //     // app.use("/customer/" + x, CustomerRT[x]);
    // });
    // let keys = Object.keys(PublicRT);
    // keys.forEach((x) => {
    //   console.log('/'+x)
    //
    //   app.use("/" + x, PublicRT[x]);
    //
    // });
    if (props && props.front && props.front.routes) {
        console.log('createTheme')

        let PR = createPublicRoute('', props.front.routes);
        app.use("/", PR);



    }
    if (props && props.admin && props.admin.routes) {
        // console.log('createAdmin')


        let PR2 = createPublicRoute('', props.admin.routes);
        app.use("/", PR2);

    }
    // let defaultRoute=returnDefaultModels();
    // if (defaultRoute) {
    //     // console.log('adnu',returnDefaultModels())
    //
    //     // let PR = createPublicRoute('/',defaultRoute.routes);
    //     let DR = createRoute(defaultRoute.modelName, defaultRoute.routes);
    //
    //     app.use("/admin", DR);
    //
    //
    //
    //
    // }

    // props.theme.routes.forEach((x) => {
    //   console.log('/',x)
    //
    //   app.use("/" + x, PR);
    //
    // });
    // app.use("/", (req,res,next)=>{
    //   the_public_route(req,res,next);
    // });
    // let PR = createPublicRoute('/admin/', []);

    // app.use('/admin',express.static(adminFolder, {index: ['index.html']}));

    // app.use("/customer/settings", CustomerRT.settings);
    let temp = [];
    props.entity.forEach((en) => {
        if (temp.indexOf(en.name) == -1) {
            temp.push(en.name);
            // app.use("/" + en.name, rou.controller);

            if (en && en.routes) {
                // console.log('createRoute', en.modelName)

                let R = createRoute(en.modelName, en.routes,'/customer/');
                // console.log('app.use', "/" + en.name, en.modelName)

                app.use("/customer/" + en.name, R);
                if(props.admin) {
                    let R2 = createRoute(en.modelName, en.routes, '/admin/');
                    app.use("/admin/" + en.name, R2);
                }
                // let adminPR = createPublicRoute('/admin/',props.theme.routes);
                // let adminPR = createPublicRoute("/admin/", en.routes);

                // app.use("/admin/"+ en.name, adminPR);

            }

        }
    })
    // console.log('app', app)
// catch 404 and forward to error handler
//     app.use(function(req, res, next) {
//
//       next(createError(404));
//     });


// error handler
//     app.use(function(err, req, res, next) {
//       // set locals, only providing error in development
//       res.locals.message = err.message;
//       res.locals.error = req.app.get("env") === "development" ? err : {};
//
//       // render the error page
//       res.status(err.status || 500);
//       if (err.status === 404) {
//         return res.redirect("/errors");
//
//       } else
//         return res.render("error");
//     });
    // } else {
    //   app.get("/", function(err, req, res, next) {
    //     console.log("hell");
    //     return res.render({ "index": "s" });
    //   });
    // }
};
export default routeHandle;
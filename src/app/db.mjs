console.log("#f db.mjs", new Date());
// import global from '#root/global';

// import Wizard from '../../wizard.js';

// Wizard.updateImportantFiles(process.env,props);
//
// import settingsController from '#controllers/settings';
// import userController from '#controllers/user';
import mongoose from "mongoose";
import path from "path";

// console.log('sdfg',path.join(path.resolve('.'), '.env.local'));


// console.log('process.env');

mongoose.Promise = global.Promise;
// console.log('process.env2');
// console.log('process.env.RESET', process.env.RESET)
// console.log('process.env.SERVER_PORT', process.env.SERVER_PORT)
console.log('process.env.mongodbConnectionUrl', process.env.mongodbConnectionUrl)
// if(!process.env.mongodbConnectionUrl)
//     process.exit(0);
let connection = process.env.mongodbConnectionUrl;
console.log('process.env.BASE_URL',process.env.BASE_URL);

let options = {
    useNewUrlParser: true,
    dbName: process.env.dbName
};
export default async (props = {},app) => {

    await props.entity.map(async e => {
        console.log('run db...',e.modelName,e.model);

        await mongoose.model(e.modelName, e.model(mongoose))
        // await
        // e.model(mongoose);
        // arr[e.name]=
    })
    // global.models=arr;
    // console.log('arr',arr);
    // models(arr);
    await mongoose
        .connect(connection, options)
        .then(async () => {
            await console.log("==> db connection successful to", process.env.dbName, new Date());

            function list(id) {
                // const path = require('path');

                const defaultOptions = {
                    prefix: '',
                    spacer: 7,
                };

                const COLORS = {
                    yellow: 33,
                    green: 32,
                    blue: 34,
                    red: 31,
                    grey: 90,
                    magenta: 35,
                    clear: 39,
                };

                const spacer = (x) => (x > 0 ? [...new Array(x)].map(() => ' ').join('') : '');

                const colorText = (color, string) => `\u001b[${color}m${string}\u001b[${COLORS.clear}m`;

                function colorMethod(method) {
                    switch (method) {
                        case 'POST':
                            return colorText(COLORS.yellow, method);
                        case 'GET':
                            return colorText(COLORS.green, method);
                        case 'PUT':
                            return colorText(COLORS.blue, method);
                        case 'DELETE':
                            return colorText(COLORS.red, method);
                        case 'PATCH':
                            return colorText(COLORS.grey, method);
                        default:
                            return method;
                    }
                }

                function getPathFromRegex(regexp) {
                    return regexp.toString().replace('/^', '').replace('?(?=\\/|$)/i', '').replace(/\\\//g, '/');
                }

                function combineStacks(acc, stack) {
                    if (stack.handle.stack) {
                        const routerPath = getPathFromRegex(stack.regexp);
                        return [...acc, ...stack.handle.stack.map((stack) => ({ routerPath, ...stack }))];
                    }
                    return [...acc, stack];
                }

                function getStacks(app) {
                    // Express 3
                    if (app.routes) {
                        // convert to express 4
                        return Object.keys(app.routes)
                            .reduce((acc, method) => [...acc, ...app.routes[method]], [])
                            .map((route) => ({ route: { stack: [route] } }));
                    }

                    // Express 4
                    if (app._router && app._router.stack) {
                        return app._router.stack.reduce(combineStacks, []);
                    }

                    // Express 4 Router
                    if (app.stack) {
                        return app.stack.reduce(combineStacks, []);
                    }

                    // Express 5
                    if (app.router && app.router.stack) {
                        return app.router.stack.reduce(combineStacks, []);
                    }

                    return [];
                }

                function expressListRoutes(app, opts) {
                    const stacks = getStacks(app);
                    const options = {...defaultOptions, ...opts };

                    if (stacks) {
                        for (const stack of stacks) {
                            if (stack.route) {
                                const routeLogged = {};
                                for (const route of stack.route.stack) {
                                    const method = route.method ? route.method.toUpperCase() : null;
                                    if (!routeLogged[method] && method) {
                                        const stackMethod = colorMethod(method);
                                        const stackSpace = spacer(options.spacer - method.length);
                                        const stackPath = path.resolve(
                                            [options.prefix, stack.routerPath, stack.route.path, route.path].filter((s) => !!s).join(''),
                                        );
                                        console.info(stackMethod, stackSpace, stackPath);
                                        routeLogged[method] = true;
                                    }
                                }
                            }
                        }
                    }

                };

                expressListRoutes(app)
            }

            list(1);
            if (process.env.RESET == 'true') {
                //if database does not have any records
                //create user...
                //& create default settings...

                // userController.exists().then((e) => {
                //     console.log('user exist...')
                // }).catch(e => {
                //     console.log('create user...')
                //
                //     //create user
                //     let req = {
                //         body: {
                //             email: process.env.ADMIN_EMAIL,
                //             username: process.env.ADMIN_USERNAME,
                //             password: process.env.ADMIN_PASSWORD
                //         }
                //     };
                //     userController.register(req);
                // })
                // settingsController.exists().then((e) => {
                //     console.log('setting exist...')
                //
                // }).catch(e => {
                //     //create setting
                //     console.log('create setting...')
                //     settingsController.create({
                //         body: {
                //             siteActive: true
                //         }
                //     })
                // })
            }
            else {
                console.log('no need to import database...')
            }
        })
        .catch(err => {
            console.error(err, "db name:", process.env.dbName)
            return process.exit(0)
        });
}
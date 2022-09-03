var path = require("path");
var dotenv = require("dotenv").config({ silent: false ,
    path: path.join(__dirname, '/.env.local'),
});
// console.log(path.join(__dirname, './.env.local'),dotenv.parsed);
// if(process.env.SITE_NAME=="idehweb"){
//     return null;
//     process.abort()
// }

module.exports = {
    apps: [{
        name: dotenv.parsed.SITE_NAME,
        script: "yarn",
        interpreter: '/bin/bash',
        args: "--cwd "+path.join(__dirname, './')+" server",
        cwd: path.join(__dirname, './'),
        env: dotenv.parsed
    }]
}
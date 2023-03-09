// console.log('process.env.TZ',process.env.TZ)
console.log("#loadEnv.mjs")
console.log('start at:', new Date())
import path from 'path';
import fs from 'fs'
import dotenv from 'dotenv'


const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
//
let envLocalPath = resolveApp('.env.local')
let envModulePath = resolveApp('./node_modules/@nodeeweb/server/.env.local')
console.log('.env is loaded from:', envLocalPath);
let envExist = fs.existsSync(envLocalPath);

//
if (!envExist) {
    envModulePath = resolveApp('./node_modules/@nodeeweb/server/.env.local')
}
let mainEnvExist = fs.existsSync(envModulePath);

if (mainEnvExist && !envExist) {
    let temp=envLocalPath;
    // console.log('create .env.local... from ', envModulePath, '\n to:', '\n' + envLocalPath);
    console.log('create .env.local...',envModulePath);
    // var data;
    // try {
    fs.readFile(envModulePath, 'utf-8', (err, data) => {
        if (!err) {
            // console.log('received data: ' + data);
            fs.writeFile(temp, data, function (err) {
                if (err) return console.log(err);
                console.log('.env.local created.');
            });
            // response.writeHead(200, {'Content-Type': 'text/html'});
            // response.write(data);
            // response.end();
        } else {
            console.log(err);
        }
    })
    // console.log('data',data,envModulePath);
    //
    // } catch (e) {
    //
    // }
    envLocalPath = envModulePath;

    // console.log('fs.promises', fs.promises)
    // fs.writeFile(envLocalPath)

}


// fs.writeFile(temp, data, function (err) {
//     if (err) return console.log(err);
//     console.log('.env.local created.');
// });
dotenv.config({
    silent: false,
    path: envLocalPath,
});
// console.log('process.env.SERVER_PORT', process.env.SERVER_PORT)

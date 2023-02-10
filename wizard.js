console.log('#wizard')
// import dotenv from "dotenv";
import path from "path";
// import dotenv from "dotenv";
import fs from "fs";
const __dirname=path.resolve();
// dotenv.config({
//     silent: false,
//     path: path.join(__dirname, './', '.env'),
// });
let Wizard = {

    filePath: path.join(__dirname, "/../../public_media/site_setting/", "config.js"),
    updateImportantFiles: function (setting,props) {
        console.log('setting', props.base);
        Wizard.updateFile("./theme/site_setting/", "config.js",
            "window.BASE_URL='" + setting.BASE_URL + "';\n" +
            "window.ADMIN_URL='" + setting.ADMIN_URL + "';\n" +
            "window.THEME_URL='" + setting.THEME_URL + "';\n" +
            "window.SHOP_URL='" + setting.SHOP_URL + "';")

        Wizard.updateFile("./public/site_setting/", "config.js",
            "window.BASE_URL='" + setting.BASE_URL + "';\n" +
            "window.ADMIN_URL='" + setting.ADMIN_URL + "';\n" +
            "window.THEME_URL='" + setting.THEME_URL + "';\n" +
            "window.SHOP_URL='" + setting.SHOP_URL + "';")

        // Wizard.updateFile("../admin/", "variables.js",
        //     "window.BASE_URL='" + setting.BASE_URL + "';\n" +
        //     "window.ADMIN_ROUTE='" + setting.ADMIN_ROUTE + "';\n" +
        //     "window.ADMIN_URL='" + setting.ADMIN_URL + "';\n" +
        //     "window.SHOP_URL='" + setting.SHOP_URL + "';")
        //
        // Wizard.updateFile("../admin-panel/public/", "variables.js",
        //     "window.BASE_URL='" + setting.BASE_URL + "';\n" +
        //     "window.ADMIN_ROUTE='" + setting.ADMIN_ROUTE + "';\n" +
        //     "window.ADMIN_URL='" + setting.ADMIN_URL + "';\n" +
        //     "window.SHOP_URL='" + setting.SHOP_URL + "';")
        if (setting.SERVER_PORT)
            Wizard.updateFile("./", ".env.local",

                "GENERATE_SOURCEMAP=false" + "\n" +
                "BABEL_CACHE_PATH=" + "\"./node_modules/babel-cache.json\"" + "\n" +
                "mongodbConnectionUrl=mongodb://127.0.0.1:27017" + "\n" +
                "SERVER_PORT=" + (setting.SERVER_PORT) + "\n" +
                "CLIENT_PORT=" + (setting.CLIENT_PORT) + "\n" +
                "dbName=" + (setting.dbName) + "\n" +
                "SITE_NAME=" + (setting.SITE_NAME) + "\n" +
                "BASE_URL=" + (setting.BASE_URL) + "\n" +
                "SHOP_URL=" + (setting.SHOP_URL) + "\n" +
                "ADMIN_URL=" + (setting.ADMIN_URL) + "\n" +
                "SERVER_MODE=" + (setting.SERVER_MODE) + "\n" +
                "RESET=false\n" +
                "ADMIN_EMAIL=" + (setting.ADMIN_EMAIL) + "\n" +
                "ADMIN_USERNAME=" + (setting.ADMIN_USERNAME) + "\n" +
                "ADMIN_PASSWORD=" + (setting.ADMIN_PASSWORD) + "\n" +
                "NODE_ENV=" + (setting.NODE_ENV) + "\n" +
                "telegramLink=" + (setting.telegramLink) + "\n" +
                "telegramChatID=" + (setting.telegramChatID) + "\n" +
                "SMS_USERNAME=" + (setting.SMS_USERNAME || process.env.SMS_USERNAME || "") + "\n" +
                "SMS_PASSWORD=" + (setting.SMS_PASSWORD || process.env.SMS_PASSWORD || "") + "\n" +
                "CHAPAR_USERNAME=" + (setting.CHAPAR_USERNAME || process.env.CHAPAR_USERNAME || "") + "\n" +
                "CHAPAR_PASSWORD=" + (setting.CHAPAR_PASSWORD || process.env.CHAPAR_PASSWORD || ""))
    },
    updateFile: function (thePath, file_name, data) {
        let filePath = path.join(__dirname, thePath, file_name);

        try {
            // fs.promises.ex
            // let tt=fs.readFile(filePath)
            console.log('reading file:',filePath)
            // fs.promises.open(filePath).then(e=>{
            //     console.log('tt',e)
            //
            // })
            fs.promises.writeFile(filePath, data, "utf8");
            console.log("\ndata is written successfully in the file\n" +
                "filePath: " + filePath + " " + file_name);
        }
        catch (err) {
            console.log("not able to write data in the file ", err);
            // return res.json({
            //   success: false,
            //   err: err
            // });
        }

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

    }


};
export default Wizard;

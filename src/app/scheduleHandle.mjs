import CronJob from "node-cron";
import global from '#root/global';
import mongoose from 'mongoose';
import axios from "axios";

const initScheduledJobs2 = (props) => {}
const initScheduledJobs = (props) => {
    console.log('new time',new Date())
    const scheduledJobFunction = CronJob.schedule("0 0 2 * * *", () => {
    // const scheduledJobFunction = CronJob.schedule("0,15,30,45 * * * * *", () => {
        // process.env.TZ="Asia/Tehran";

        console.log('new time',new Date())
        // console.log('process.env.TZ',process.env.TZ)

        global.fireEvent('send-schedule-message-by-system', {},props,{mongoose,httpRequest: axios
    });
        // console.log("I'm executed on a schedule!",new Date());
        // let functions = [];
        // props.entity.forEach((en, d) => {
        //     if (en.functions) {
        //         en.functions.forEach((fn) => {
        //             console.log('fn', fn)
        //             functions.push(fn);
        //         });
        //     }
        //     if (en.hook) {
        //         en.hook.forEach((hook) => {
        //             if (hook.event == event) {
        //                 console.log('run event ...', hook.name)
        //                 hook.func(req,res,next,params);
        //             }
        //         });
        //     }
        // })
        // Add your custom logic here
    },{
        timezone:"Asia/Tehran"
    });

    scheduledJobFunction.start();
}
export default initScheduledJobs
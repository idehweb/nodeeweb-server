import CronJob from "node-cron";
import global from '#root/global';

const initScheduledJobs = (props) => {}
const initScheduledJobs2 = (props) => {
    const scheduledJobFunction = CronJob.schedule("*/10 * * * * *", () => {
        global.fireEvent('schedule-task', {});
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
    });

    scheduledJobFunction.start();
}
export default initScheduledJobs
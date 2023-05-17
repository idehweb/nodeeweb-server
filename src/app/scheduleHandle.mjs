import CronJob from 'node-cron';
import global from '../global.mjs';
import mongoose from 'mongoose';
import axios from 'axios';
import { SingleJobProcess } from '../job/index.mjs';

const initScheduledJobs2 = (props) => {};
const initScheduledJobs = (props) => {
  console.log('new time', new Date());
  if (!props.schedules) props.schedules = [];
  let scTemp = [];
  // CronJob.schedule("1 * * * * *", () => {
  //     console.log('cronjob by plugin...:',new Date())
  //     // global.fireEvent(item.name, {}, props, {mongoose, httpRequest: axios});
  //     // item.function=
  // }, {
  //     timezone: process.env.TZ || "Asia/Tehran",
  //     scheduled:true
  // })
  // if(false)
  props.schedules.forEach((item, i) => {
    // console.log('item.setting', item.setting)
    // console.log('item.action', item.action)
    if (item.path && item.variable)
      global.getSetting('plugins').then((r) => {
        // console.log('my setting:', r[item.path][item.variable]);
        if (!item.setting) {
          item.setting = '* * * * * *';
        }
        // console.log('item.setting', item.setting)
        scTemp[i] = CronJob.schedule(
          r[item.path][item.variable]
            ? r[item.path][item.variable]
            : item.setting,
          SingleJobProcess.builderAsync(`${item.name}_${item.setting}`, () => {
            console.log('cronjob by plugin...:', item.name, item.setting);
            global.fireEvent(item.name, {}, props, {
              mongoose,
              httpRequest: axios,
              global: global,
            });
            // item.function=
          }),
          {
            timezone: process.env.TZ || 'Asia/Tehran',
            scheduled: false,
          }
        );
        // .start();
        scTemp[i].start();
        // }
      });
  });
  const scheduledJobFunction = CronJob.schedule(
    '0 0 0 * * *',
    SingleJobProcess.builderAsync('send-schedule-message-by-system', () => {
      // const scheduledJobFunction = CronJob.schedule("0,15,30,45 * * * * *", () => {
      // process.env.TZ="Asia/Tehran";

      console.log('new time', new Date());
      // console.log('process.env.TZ',process.env.TZ)

      global.fireEvent('send-schedule-message-by-system', {}, props, {
        mongoose,
        httpRequest: axios,
        global: global,
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
    }),
    {
      timezone: process.env.TZ || 'Asia/Tehran',
    }
  );

  scheduledJobFunction.start();
  // scTemp.forEach((process, key) => {
  //     process.start();
  // });
};
export default initScheduledJobs;

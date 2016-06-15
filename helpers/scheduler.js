"use strict";
var schedule = require('node-schedule');
const UserFlow = require('../models/user-flow');

const Scheduler = module.exports = {

  initScheduler : function() {
    // query db for user flows and their schedule time
    UserFlow.find()
      .then((flows) => {

        flows.forEach((flow) => {
          // setup cron pattern to ini scheduling
          let cron_base = {
            hour: flow.created_at.getHours(),
            minute: flow.created_at.getMinutes()
          }
          let cron_pattern = {
            dayOfWeek: flow.created_at.getDay()
          };
          switch (flow.send_interval) {
            case 'monthly':
              cron_pattern = {
                dayOfMonth : flow.created_at.getUTCDate()
              }
              break;
            default:
              break;
          }

          cron_pattern = Object.assign(cron_base, cron_pattern);
          // setup a job for every flow
          var j = schedule.scheduleJob(cron_pattern, function(){
            // create and send digest
            flow.buildDigest();
          });

        });


      });

  }

}

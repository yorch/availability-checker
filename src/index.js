require('dotenv').config();

const { logger } = require('./utils/logger');
const { AvailabilityChecker } = require('./availability-checker');
const { sendEmail, sendPushbullet, sendSms } = require('./actions');
const { cronSchedule } = require('./config');
const { Amazon } = require('./scrappers/amazon');
const { BestBuy } = require('./scrappers/bestbuy');
const { GameStop } = require('./scrappers/gamestop');
const { Target } = require('./scrappers/target');
const { Walmart } = require('./scrappers/walmart');

const availabilityChecker = new AvailabilityChecker({
    actions: [sendEmail, sendPushbullet, sendSms],
    logger,
    scrappers: [Amazon, BestBuy, GameStop, Target, Walmart],
});

if (cronSchedule) {
    availabilityChecker.setupSchedule(cronSchedule);
} else {
    // Run once
    availabilityChecker.run();
}

process.on('SIGTERM', () => {
    logger.info('Got a SIGTERM, exiting');
    process.exit(1);
});

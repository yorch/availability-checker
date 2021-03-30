require('dotenv').config();

const { sendEmail, sendPushbullet, sendSms } = require('./actions');
const { AvailabilityChecker } = require('./availability-checker');
const { cronSchedule } = require('./config');
const { logger } = require('./logger');
const { Amazon } = require('./scrappers/amazon');
const { BestBuy } = require('./scrappers/bestbuy');
const { Evga } = require('./scrappers/evga');
const { GameStop } = require('./scrappers/gamestop');
const { Target } = require('./scrappers/target');
const { Walmart } = require('./scrappers/walmart');

const availabilityChecker = new AvailabilityChecker({
    actions: [sendEmail, sendPushbullet, sendSms],
    logger,
    scrappers: [Amazon, BestBuy, Evga, GameStop, Target, Walmart],
});

if (cronSchedule) {
    availabilityChecker.setupSchedule(cronSchedule);
} else {
    // Run once
    availabilityChecker.run();
}

process.on('uncaughtException', (err) => {
    logger.error(`There was an uncaughtException`, err);
});

process.on('unhandledRejection', (err) => {
    logger.error('There was an unhandledRejection', err);
});

process.on('SIGTERM', () => {
    logger.info('Got a SIGTERM, exiting');
    process.exit(1);
});

require('dotenv').config();

const { logger } = require('./utils/logger');
const { AvailabilityChecker } = require('./availability-checker');
const { sendEmail, sendPushbullet, sendSms } = require('./actions');
const { cronSchedule } = require('./config');
const { Walmart } = require('./scrappers/walmart');
const { BestBuy } = require('./scrappers/bestbuy');

const availabilityChecker = new AvailabilityChecker({
    actions: [sendEmail, sendPushbullet, sendSms],
    logger,
    scrappers: [Walmart, BestBuy],
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

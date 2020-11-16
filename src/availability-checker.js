const cron = require('node-cron');
const products = require('./products.json');

class AvailabilityChecker {
    constructor({ actions, logger, scrappers }) {
        this.actions = actions;
        this.logger = logger;
        this.scrappers = scrappers.filter(Boolean);

        this.logger.debug('scrappers', this.scrappers);
    }

    async run() {
        try {
            const promises = this.scrappers
                .map(async (Scrapper) => {
                    const scrapper = new Scrapper({ logger: this.logger });
                    const { name } = scrapper;
                    this.logger.info(`Processing ${name}`);
                    try {
                        const res = await scrapper.run(products.filter(({ source_name }) => name === source_name));
                        this.logger.info(`Finished processing ${name}`);
                        return res;
                    } catch (error) {
                        this.logger.error(`Error processing ${name}`, error);
                    }
                })
                .filter(Boolean);

            const allProducts = (await Promise.all(promises)).flat().filter(Boolean);

            if (!allProducts || allProducts.length === 0) {
                this.logger.error('Could not process any product');
            } else {
                this.logger.info(JSON.stringify(allProducts, null, 2));
                const availableProducts = allProducts.filter(({ isAvailable }) => isAvailable);
                this.logger.info(`Processed ${allProducts.length} products (${availableProducts.length} available)`);

                // TODO: Maybe consolidate multiple messages into same action (ie: same email)
                availableProducts.forEach(({ message }) => {
                    this.logger.info(message);
                    this.actions.forEach((action) => action({ content: message, logger: this.logger }));
                });
            }
        } catch (err) {
            this.logger.error('There was an error on the main run', err);
        }
    }

    setupSchedule(schedule) {
        if (this.scheduledTask) {
            this.logger.error('There is already an scheduled task');
            return;
        }
        this.scheduledTask = cron.schedule(schedule, () => {
            this.run();
        });
    }

    stopSchedule() {
        if (!this.scheduledTask) {
            this.logger.error('There is no scheduled task');
            return;
        }
        // this.scheduledTask.stop();
        this.scheduledTask.destroy();
        this.scheduledTask = null;
    }
}

module.exports = {
    AvailabilityChecker,
};

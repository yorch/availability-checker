const cheerio = require('cheerio');
const { got } = require('../got');

class BaseScrapper {
    constructor({ logger }) {
        this.logger = logger;
    }

    run(products) {
        return Promise.all(
            products.map(async ({ name, url }) => {
                this.logger.debug(`Making request to ${url}`);
                try {
                    const { body } = await got(url);
                    this.logger.debug(`Obtained response from ${url}`);
                    const $document = cheerio.load(body);
                    return {
                        name,
                        source: this.name,
                        url,
                        ...this.parseHtml($document)
                    };
                } catch (error) {
                    this.logger.error(error);
                }
            })
        );
    }
}

module.exports = {
    BaseScrapper
};

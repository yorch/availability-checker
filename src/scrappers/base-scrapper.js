const cheerio = require('cheerio');
const { got } = require('../got');

class BaseScrapper {
    constructor({ logger }) {
        this.logger = logger;
    }

    async preAll() {}

    async postAll() {}

    trimString(str) {
        return (str || '').trim().replace(/\n/g, '');
    }

    async obtainProduct({ name, url }) {
        this.logger.debug(`Making request to ${url}`);
        try {
            const { body } = await got(url);
            this.logger.debug(`Obtained response from ${url}`);
            const $document = cheerio.load(body);
            return {
                name,
                source: this.name,
                url,
                ...this.parseHtml($document),
            };
        } catch (err) {
            this.logger.error(`Error processing ${name}: ${url}`, err);
        }
    }

    async run(products) {
        await this.preAll();
        const res = await Promise.all(products.map(this.obtainProduct.bind(this)));
        await this.postAll();
        return res;
    }
}

module.exports = {
    BaseScrapper,
};

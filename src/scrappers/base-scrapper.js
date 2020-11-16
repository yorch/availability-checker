const cheerio = require('cheerio');
const { oneLine } = require('common-tags');
const { got } = require('../got');

class BaseScrapper {
    constructor({ logger }) {
        this.logger = logger;
    }

    async preAll() {}

    async postAll() {}

    composeMessage({ name, title, availability, isAvailable, price, sku, source, url }) {
        return oneLine`
            ${name} (${source}):
            ${isAvailable ? 'Available' : 'Not Available'}
            (${availability}) ==> ${price} (${url})
        `;
    }

    trimString(str) {
        return (str || '').trim().replace(/\n/g, '');
    }

    async obtainProduct({ name, url }) {
        this.logger.debug(`Making request to ${url}`);
        try {
            const { body } = await got(url);
            this.logger.debug(`Obtained response from ${url}`);
            const $document = cheerio.load(body);
            const product = this.parseHtml($document);
            return {
                name,
                source: this.name,
                url,
                message: this.composeMessage(product),
                ...product,
            };
        } catch (err) {
            this.logger.error(`Error processing ${name} at ${this.name}: ${url}`, err);
        }
    }

    async run(products) {
        await this.preAll();
        const res = await Promise.all(products.map(this.obtainProduct.bind(this)));
        await this.postAll();
        return res.filter(Boolean);
    }
}

module.exports = {
    BaseScrapper,
};

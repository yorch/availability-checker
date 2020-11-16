const cheerio = require('cheerio');
const { oneLine } = require('common-tags');
const got = require('got');
const { scrapper } = require('../config');

class BaseScrapper {
    constructor({ logger }) {
        this.logger = logger;
    }

    async preAll() {}

    async postAll() {}

    composeMessage({ title, availability, isAvailable, price, sku, source, url }) {
        return oneLine`
            ${title} (${source}):
            ${isAvailable ? 'Available' : 'Not Available'}
            (${availability}) => ${price} (${url})
        `;
    }

    trimString(str) {
        return (str || '').trim().replace(/\n/g, '');
    }

    async obtainProduct({ name, url }) {
        this.logger.debug(`Making request to ${url}`);
        try {
            const { body } = await got(url, {
                headers: {
                    'accept-language': 'en-US,en;q=0.9',
                    'cache-control': 'no-cache',
                    'user-agent': scrapper.userAgent,
                },
                followRedirect: true,
                http2: true, // Needed by BestBuy
                maxRedirects: 5,
                timeout: scrapper.timeout,
                retry: 1,
                responseType: 'text',
            });
            this.logger.debug(`Obtained response from ${url}`);
            const $document = cheerio.load(body);
            const product = await this.parsePage($document);
            const source = this.name;
            return {
                name,
                source,
                url,
                message: this.composeMessage({ ...product, name, source, url }),
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

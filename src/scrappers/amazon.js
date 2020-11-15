const { BaseScrapper } = require('./base-scrapper');

class Amazon extends BaseScrapper {
    name = 'amazon';

    parseHtml($) {
        const availability = this.trimString($('#availability').text());

        return {
            title: this.trimString($('#productTitle').text()),
            availability,
            price: '',
            sku: '',
            isAvailable: !availability.includes('Currently unavailable'),
        };
    }
}

module.exports = {
    Amazon,
};

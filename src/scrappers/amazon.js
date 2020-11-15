const { BaseScrapper } = require('./base-scrapper');

class Amazon extends BaseScrapper {
    name = 'amazon';

    parseHtml($) {
        const availability = this.trimString($('#availability').text()).toLowerCase();

        return {
            title: this.trimString($('#productTitle').text()),
            availability,
            price: '',
            sku: '',
            isAvailable: !availability.includes('unavailable'),
        };
    }
}

module.exports = {
    Amazon,
};

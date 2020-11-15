const { BaseScrapper } = require('./base-scrapper');

class Amazon extends BaseScrapper {
    name = 'amazon';

    parseHtml($) {
        const title = $('#productTitle').text().trim();
        const availability = $('#availability').text().trim();

        return {
            title,
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

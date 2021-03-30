const { BaseScrapper } = require('./base-scrapper');

class Evga extends BaseScrapper {
    name = 'evga';

    parsePage($) {
        // TODO: Figure what's the selector when there is stock
        const availability = this.trimString($('#LFrame_pnlOutOfStock').text()).toLowerCase();

        return {
            title: this.trimString($('#LFrame_lblProductName').text()),
            availability,
            price: '', // TODO
            sku: '', // TODO
            isAvailable: Boolean($('#LFrame_pnlOutOfStock')),
        };
    }
}

module.exports = {
    Evga,
};

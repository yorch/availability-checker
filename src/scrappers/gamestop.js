const { BaseScrapper } = require('./base-scrapper');

class GameStop extends BaseScrapper {
    name = 'gamestop';

    parseHtml($) {
        const { productInfo, price } = $('.add-to-cart').data('gtmdata');
        // const price = $('.actual-price').text();
        const { sellingPrice } = price;
        const { availability, sku } = productInfo;

        return {
            title: this.trimString($('[itemprop="name"]').text()),
            availability,
            price: sellingPrice,
            sku,
            isAvailable: availability !== 'Not Available',
        };
    }
}

module.exports = {
    GameStop,
};

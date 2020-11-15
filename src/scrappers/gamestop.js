const { BaseScrapper } = require('./base-scrapper');

class GameStop extends BaseScrapper {
    name = 'gamestop';

    parseHtml($) {
        const title = $('[itemprop="name"]').text();
        const { productInfo, price } = $('.add-to-cart').data('gtmdata');
        // const price = $('.actual-price').text();
        const { sellingPrice } = price;
        const { availability, sku } = productInfo;

        return {
            title,
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

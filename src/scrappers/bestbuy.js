const { BaseScrapper } = require('./base-scrapper');

class BestBuy extends BaseScrapper {
    name = 'bestbuy';

    parseHtml($) {
        const title = $('[itemprop="name"]').text();
        const price = $(
            '.priceView-customer-price [aria-hidden="true"]'
        ).text();
        const availability = $('.add-to-cart-button').text();
        const sku = $('div.sku.product-data .product-data-value').text();

        return {
            title,
            availability,
            price,
            sku,
            isAvailable: availability !== 'Sold Out'
        };
    }
}

module.exports = {
    BestBuy
};

const { BaseScrapper } = require('./base-scrapper');
const { BaseDynamicScrapper } = require('./base-dynamic-scrapper');

class BestBuy extends BaseDynamicScrapper {
    name = 'bestbuy';

    async parseHtml($) {
        const title = await (await $('[itemprop=name]')).textContent();
        const price = await (await $('.priceView-customer-price [aria-hidden="true"]')).textContent();
        const availability = await (await $('.add-to-cart-button')).textContent();
        const sku = await (await $('div.sku.product-data .product-data-value')).textContent();

        return {
            title,
            availability,
            price,
            sku,
            isAvailable: availability !== 'Sold Out',
        };
    }
}

module.exports = {
    BestBuy,
};

const { BaseScrapper } = require('./base-scrapper');
const { BaseDynamicScrapper } = require('./base-dynamic-scrapper');

class BestBuy extends BaseDynamicScrapper {
    name = 'bestbuy';

    async parseHtml($) {
        const availability = await (await $('.add-to-cart-button')).textContent();

        return {
            title: await (await $('[itemprop=name]')).textContent(),
            availability,
            price: await (await $('.priceView-customer-price [aria-hidden="true"]')).textContent(),
            sku: await (await $('div.sku.product-data .product-data-value')).textContent(),
            isAvailable: availability !== 'Sold Out',
        };
    }
}

module.exports = {
    BestBuy,
};

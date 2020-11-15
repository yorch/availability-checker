const { BaseDynamicScrapper } = require('./base-dynamic-scrapper');

class Target extends BaseDynamicScrapper {
    name = 'target';

    // apiKey = 'ff457966e64d5e877fdbad070f276d18ecec4a01';
    // apiZipCode = '33178';
    // apiRadius = 70;
    // apiUrl =
    //     'https://api.target.com/fulfillment_aggregator/v1/fiats/81114595?key={apiKey}&nearby={zipCode}&limit=50&requested_quantity=1&radius={apiRadius}&fulfillment_test_mode=grocery_opu_team_member_test';

    async parseHtml($) {
        const $soldOut = await $('[data-test=soldOutBlock]');
        const $soldOutNearBy = await $('[data-test=outOfStockNearbyMessage]');
        const availability = ($soldOut
            ? this.trimString(await $soldOut.textContent())
            : $soldOutNearBy
            ? this.trimString(await $soldOutNearBy.textContent())
            : ''
        ).toLowerCase();

        return {
            title: this.trimString(await (await $('[data-test=product-title]')).textContent()),
            availability,
            price: this.trimString(await (await $('[data-test=product-price]')).textContent()),
            sku: '',
            isAvailable: !(availability.includes('sold out') || availability.includes('out of stock')),
        };
    }
}

module.exports = {
    Target,
};

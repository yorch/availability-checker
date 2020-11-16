const { BaseScrapper } = require('./base-scrapper');

class Walmart extends BaseScrapper {
    name = 'walmart';

    parsePage($) {
        const $productOverview = $('#product-overview');
        const title = $('h1.prod-ProductTitle', $productOverview).text();
        const price = $('span[itemprop="price"]', $productOverview).attr('content');
        const availability = $('link[itemprop="availability"]', $productOverview).attr('href');
        const sku = $('meta[itemprop="sku"]', $productOverview).attr('content');

        return {
            title,
            availability,
            price,
            sku,
            isAvailable: availability !== '//schema.org/OutOfStock',
        };
    }
}

module.exports = {
    Walmart,
};

const got = require('got');
const { scrapper } = require('./config');

module.exports = {
    got: got.extend({
        headers: {
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'user-agent': scrapper.userAgent,
        },
        followRedirect: true,
        http2: true, // Needed by BestBuy
        maxRedirects: 5,
        timeout: 2 * 1000,
        retry: 1,
        responseType: 'text',
    }),
};

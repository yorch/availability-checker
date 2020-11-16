const { chromium } = require('playwright-chromium');
const { snakeCase } = require('snake-case');
const { BaseScrapper } = require('./base-scrapper');
const { scrapper } = require('../config');

class BaseDynamicScrapper extends BaseScrapper {
    async preAll() {
        this.browser = await chromium.launch({
            headless: !scrapper.disableHeadless,
            timeout: scrapper.timeout,
        });
        this.context = await this.browser.newContext({
            bypassCSP: true,
            ignoreHTTPSErrors: true,
            userAgent: scrapper.userAgent,
        });
    }

    async postAll() {
        this.context && (await this.context.close());
        this.browser && (await this.browser.close());
    }

    async obtainProduct({ name, url }) {
        let page;
        try {
            this.logger.debug(`Making request to ${url}`);
            page = await this.context.newPage();
            // page.on('console', async (c) => {
            //     console.log(c, c.args(), c.location(), c.type());
            // });
            await page.goto(url);
            if (scrapper.saveScreenshot) {
                await page.screenshot({
                    path: `screenshots/${this.name}/${snakeCase(name)}-${Date.now()}.png`,
                    fullPage: true,
                });
            }
            return {
                name,
                source: this.name,
                url,
                ...(await this.parseHtml(page.$.bind(page))),
            };
        } catch (err) {
            this.logger.error(`Error processing ${name}: ${url}`, err);
        } finally {
            page && (await page.close());
        }
    }
}

module.exports = {
    BaseDynamicScrapper,
};

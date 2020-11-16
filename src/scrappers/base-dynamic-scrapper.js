const path = require('path');
const { chromium } = require('playwright-chromium');
const { snakeCase } = require('snake-case');
const { scrapper, screenshotsDirectory } = require('../config');
const { formatCurrentDateTime } = require('../utils');
const { BaseScrapper } = require('./base-scrapper');

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
            this.logger.debug(`Loading page ${url}`);
            page = await this.context.newPage();
            // page.on('console', async (c) => {
            //     console.log(c, c.args(), c.location(), c.type());
            // });
            await page.goto(url);
            this.logger.debug(`Page loaded ${url}`);
            if (scrapper.saveScreenshot) {
                await page.screenshot({
                    path: path.join(
                        screenshotsDirectory,
                        this.name,
                        `${snakeCase(name)}-${formatCurrentDateTime()}.png`
                    ),
                    fullPage: true,
                });
            }
            const product = await this.parsePage(page.$.bind(page));
            const source = this.name;
            return {
                name,
                source,
                url,
                message: this.composeMessage({ ...product, name, source, url }),
                ...product,
            };
        } catch (err) {
            this.logger.error(`Error processing ${name} at ${this.name}: ${url}`, err);
        } finally {
            page && (await page.close());
        }
    }
}

module.exports = {
    BaseDynamicScrapper,
};

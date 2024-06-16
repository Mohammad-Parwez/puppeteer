const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const eventUrl = 'https://b2bmarketing.exchange';

    try {
        await page.goto(eventUrl, { waitUntil: 'networkidle2' });

        const eventInfo = await page.evaluate(() => {
            const getText = (selector) => document.querySelector(selector)?.innerText.trim() || 'N/A';
            const getMultipleText = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.innerText.trim());

            // Function to extract pricing details
            const getPricingDetails = (pricingSelector) => {
                const pricingElements = document.querySelectorAll(pricingSelector);
                const pricingDetails = [];
                pricingElements.forEach(element => {
                    pricingDetails.push(element.innerText.trim());
                });
                return pricingDetails.join(', ');
            };

            // Function to extract categories
            const getCategories = (categoriesSelector) => {
                const categoriesElements = document.querySelectorAll(categoriesSelector);
                const categoriesList = [];
                categoriesElements.forEach(element => {
                    categoriesList.push(element.innerText.trim());
                });
                return categoriesList.join(', ');
            };

            // Function to extract audience type information
            const getAudienceType = (audienceSelector) => {
                const audienceElements = document.querySelectorAll(audienceSelector);
                const audienceType = [];
                audienceElements.forEach(element => {
                    audienceType.push(element.innerText.trim());
                });
                return audienceType.join(', ');
            };

            return {
                eventName: 'B2B Marketing Exchange (B2BMX) 2024',
                eventDates: getText('.elementor-widget-container .elementor-icon-list-text'),
                location: getText('.elementor-widget-container .elementor-icon-list-items .elementor-icon-list-item:last-child .elementor-icon-list-text'),
                description: getText('.elementor-widget-container p'),
                keySpeakers: getMultipleText('.swiper-slide-contents'),
                agendaSchedule: getMultipleText('.agenda__schedule-item.elementor-widget-wrap .elementor-element-bbe08e5 .elementor-heading-title, .elementor-element-6460173 .elementor-heading-title'),
                registrationDetails: getText('.registration__info'),
                pricing: getPricingDetails('.pricing__info .elementor-text-editor li'),
                categories: getCategories('.elementor-widget-wrap .elementor-element-populated .category__list li'),
                audienceType: getAudienceType('.elementor-widget-wrap .elementor-element-populated ol li')
            };
        });

        console.log(JSON.stringify(eventInfo, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
})();

import { chromium } from '@playwright/test'
import { Hooks } from '../utils/hooks';

export default async function globalSetup() {
    try {
        const browser = await chromium.launch();
        const appUrl = process.env.APP_URL || "App URL not found!";
        const apiUrl = process.env.API_URL || "Api URL not found!";

        const hooks = new Hooks();

        for (const role of ['none', 'regular', 'admin']) {
            const page = await browser.newPage();
            await hooks.generateLoggedInState(role, appUrl, apiUrl, page);
            await page.close();
        }

        await browser.close();
    } catch (error: any) {
        console.error('Error in global setup: ', error);
        throw error;
    }
}
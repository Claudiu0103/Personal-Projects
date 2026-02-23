import { expect, Page } from "@playwright/test";
import { CommonVars } from "./common-vars";
import { Timeouts } from "./timeouts";

export class Hooks {

    public async generateLoggedInState(logInAs: string, appUrl: string, apiUrl: string, page: Page) {
        await page.goto(appUrl + '/login');

        switch (logInAs) {
            case 'none':
                await page.context().storageState({ path: CommonVars.NOT_LOGGED_IN_STATE });
                return;
            case 'regular':
                await page.locator('#email').fill(CommonVars.REGULAR_USER_EMAIL);
                await page.locator('#password').fill(CommonVars.REGULAR_USER_PASSWORD);
                break;
            case 'admin':
                await page.locator('#email').fill(CommonVars.ADMIN_USER_EMAIL);
                await page.locator('#password').fill(CommonVars.ADMIN_USER_PASSWORD);
                break;
            default:
                throw new Error('Invalid log in identity received!');
        }

        await page.locator('form button[type="submit"]').click();

        await page.waitForURL(appUrl + "/home");

        await page.context().storageState({ path: `./src/config/${logInAs}LoggedInState.json` });
        await page.goto(appUrl + '/home', { timeout: Timeouts.LONGEST_TIMEOUT });
    }
}
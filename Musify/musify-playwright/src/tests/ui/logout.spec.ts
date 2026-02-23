import test from "@playwright/test";
import { HomePage } from "../../pages/home-page";


test.describe('Logout Tests', () => {
    test.use({ storageState: 'src/config/regularLoggedInState.json' });
    let homePage: HomePage;
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    test('Verify if clicking logout button successfully logs user out', async () => {
        await homePage.logout();
    });

})
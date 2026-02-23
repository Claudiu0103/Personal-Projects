import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';

test.use({ storageState: './src/config/regularLoggedInState.json' });

test.describe('Show Song Details Tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.profileIconVisible();
    })

    test('Verify if song details modal gets displayed correctly when user clicks a song card', async () => {
        await homePage.mostWantedSongsDisplayed();

        const titleFromCard = await homePage.clickFirstSongCard();
        await homePage.expectCorrectModalOpen(titleFromCard);
    });
});
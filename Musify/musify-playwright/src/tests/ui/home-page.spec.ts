import { test } from '@playwright/test';
import { HomePage } from '../../pages/home-page';

test.use({ storageState: './src/config/regularLoggedInState.json' });

test.describe('Home Page Tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.profileIconVisible();
    })

    test('Verify if song cards are displayed in the Most Wanted Songs section', async () => {
        await homePage.mostWantedSongsDisplayed();
    });

    test('Verify if artist cards are displayed in the Your Favorite Artists section', async () => {
        await homePage.yourFavoriteArtistsDisplayed();
    });

    test('Verify if album cards are displayed in the Hot Albums section', async () => {
        await homePage.hotAlbumsDisplayed();
    });

    test('Verify if playlist cards are displayed in the Top Playlists section', async () => {
        await homePage.topPlaylistsDisplayed();
    });
});
import { test, expect } from '@playwright/test';
import { ArtistsPage } from '../../pages/artists-page';
import { Functions } from '../../utils/functions';
import { Timeouts } from '../../utils/timeouts';

test.use({ storageState: './src/config/regularLoggedInState.json' });

test.describe('Artists Page Tests', () => {
    let artistsPage: ArtistsPage;

    test.beforeEach(async ({ page }) => {
        artistsPage = new ArtistsPage(page);
        await artistsPage.goto();
        await artistsPage.isTitleVisible();
    })

    test('Verify if artist cards are correctly displayed', async () => {
        const count = await artistsPage.numberOfArtists();
        expect(count).toBeGreaterThan(0);
    });

    test('Verify if artist card displays correct information', async () => {
        const count = await artistsPage.numberOfArtists();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const info = await artistsPage.getArtistCardInfo(i);
            expect(info.type).not.toBe('');
            expect(info.name).not.toBe('');
        }
    });

    test('Verify if clicking an artist card navigates to artist details page', async ({ page }) => {
        const count = await artistsPage.numberOfArtists();
        if (count > 0) {
            await artistsPage.clickFirstArtistCard();
            await expect(page).toHaveURL(/\/artists\/[^\/]+$/);
        }
    })

    test.describe('Pagination Tests', () => {

        test.beforeEach(async ({ page }) => {
            await page.route('**/api/artists/paginate?offset=0&limit=20', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(Functions.generateArtists(1, 20)),
                });
            });

            await page.route('**/api/artists/paginate?offset=20&limit=20', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(Functions.generateArtists(21, 40)),
                });
            });

            await artistsPage.goto();
        })

        test('Verify if more artists are loaded when user scrolls the page', async ({ page }) => {
            await page.waitForTimeout(Timeouts.SHORTEST_TIMEOUT);
            let count = await artistsPage.numberOfArtists();
            expect(count).toBe(20);

            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await page.waitForTimeout(Timeouts.SHORTEST_TIMEOUT);
            count = await artistsPage.numberOfArtists();
            expect(count).toBe(40);
        });
    })
})
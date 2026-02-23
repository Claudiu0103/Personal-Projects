import { test, expect } from '@playwright/test';
import { AlbumPage } from '../../pages/albums-page';

test.use({ storageState: './src/config/regularLoggedInState.json' });

test.describe('Albums Page Tests', () => {
  let albumPage: AlbumPage;

  test.beforeEach(async ({ page }) => {
    albumPage = new AlbumPage(page);
    await albumPage.goto();
    await albumPage.isTitleVisible();
  });

  test('Verify if user sees no albums message if there are no albums present', async () => {
    if (await albumPage.albumCards.count() === 0) {
      await expect(albumPage.emptyMessage).toBeVisible();
    }
  });

  test('Verify if album cards are displayed with correct information', async ({ page }) => {
    await page.waitForSelector('.album-card');

    const count = await albumPage.albumCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const info = await albumPage.getAlbumCardInfo(i);
      expect(info.title).not.toBe('');
      expect(info.genre).not.toBe('');
      expect(info.artist).not.toBe('');
      expect(info.releaseDate).toMatch(/\d{4}/);
    }
  });

  test('Verify if clicking an album card navigates to album details page', async ({ page }) => {
    const count = await albumPage.albumCards.count();
    if (count > 0) {
      await albumPage.clickAlbumCard(0);
      await expect(page).toHaveURL(/\/albums\/[^\/]+$/);
    }
  });
});

import { test, expect } from '@playwright/test';
import { PlaylistsPage } from '../../pages/playlist-page';

test.use({ storageState: 'src/config/regularLoggedInState.json' });

test.describe('Playlists Page Tests', () => {
  let playlistsPage: PlaylistsPage;

  test.beforeEach(async ({ page }) => {
    playlistsPage = new PlaylistsPage(page);
    await playlistsPage.goto();
    await playlistsPage.isTitleVisible();
  });

  test('Verify if playlist page title is visible', async () => {
    await expect(playlistsPage.titleLocator).toBeVisible();
  });

  test('Verify if playlist cards are displayed correctly', async () => {
    await playlistsPage.isTitleVisible();
    await playlistsPage.playlistCardsLocator.first().waitFor({ state: 'visible' });
    const count = await playlistsPage.getPlaylistCount();
    expect(count).toBeGreaterThan(0);
  });

  test('Verify if playlist cards display correct playlist data', async () => {
    await playlistsPage.playlistCardsLocator.first().waitFor({ state: 'visible' });
    const count = await playlistsPage.getPlaylistCount();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const info = await playlistsPage.getPlaylistCardInfo(i);
      expect(info.name).not.toBe('');
      expect(info.owner).not.toBe('');
    }
  });

  test('Verify that clicking on a playlist card navigates user to playlist detail page', async ({ page }) => {
    const count = await playlistsPage.getPlaylistCount();
    if (count > 0) {
      await playlistsPage.clickFirstPlaylistCard();
      await expect(page).toHaveURL(/\/playlists\/\d+$/);
    }
  });
});

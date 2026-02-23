import { test, expect } from '@playwright/test';
import { PlaylistsPage } from '../../pages/playlist-page';
import { PlaylistSimple } from '../../utils/interface';
import { MockData } from '../../utils/mock-data';

test.use({ storageState: 'src/config/regularLoggedInState.json' });

test.describe('Playlist Follow/Unfollow Tests', () => {
  let playlistsPage: PlaylistsPage;

  test.beforeEach(async ({ page }) => {
    playlistsPage = new PlaylistsPage(page);
    await playlistsPage.goto();
    await playlistsPage.isTitleVisible();
    await playlistsPage.disableCardNavigation();
  });

  test('Verify if user can follow and unfollow a playlist', async () => {
    const count = await playlistsPage.getPlaylistCount();
    expect(count).toBeGreaterThan(0);

    expect(await playlistsPage.getFirstPlaylistCardFollowText()).toBe('Follow');
    await playlistsPage.clickFirstPlaylistCardToggleFollow();
    expect(await playlistsPage.getFirstPlaylistCardFollowText()).toBe('Unfollow');
    await playlistsPage.clickFirstPlaylistCardToggleFollow();
    expect(await playlistsPage.getFirstPlaylistCardFollowText()).toBe('Follow');
  });
});
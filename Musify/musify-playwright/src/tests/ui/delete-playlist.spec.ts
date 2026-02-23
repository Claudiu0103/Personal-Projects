import { test, expect, Page } from '@playwright/test';
import { PlaylistDetailsPage } from '../../pages/delete-playlist';
import { faker } from '@faker-js/faker';
import { Timeouts } from '../../utils/timeouts';

test.describe('Delete Playlist Tests', () => {
  test.use({ storageState: 'src/config/adminLoggedInState.json' });

  let playlistDetailsPage: PlaylistDetailsPage;
  let page: Page;

  test.beforeEach(async ({ page: currentPage }) => {
    page = currentPage;
    playlistDetailsPage = new PlaylistDetailsPage(page);
    await playlistDetailsPage.gotoMainPlaylistPage();
  });

  test('Verify if user can delete newly created playlist', async () => {
    const playlistName = `Playlist Test ${faker.music.genre()} ${faker.number.int()}`;
    const createdPlaylistId = await playlistDetailsPage.createPlaylist(playlistName);
    await playlistDetailsPage.goto(createdPlaylistId);
    await playlistDetailsPage.waitForPlaylistToLoad(playlistName);

    const title = await playlistDetailsPage.getPlaylistTitle();
    expect(title).toContain('Playlist Test');

    expect(await playlistDetailsPage.isDeleteButtonVisible()).toBe(true);

    await playlistDetailsPage.deletePlaylist();

    await expect(page.locator('app-playlists')).toBeVisible({ timeout: Timeouts.NAVIGATION_TIMEOUT });

    expect(page.url()).not.toContain(`/playlists/${createdPlaylistId}`);

    await playlistDetailsPage.waitForSuccessToast();

    const message = await playlistDetailsPage.getSuccessToastMessage();
    expect(message).toContain('Playlist deleted successfully');
  });

  test('Verify if delete button is not be visible on playlist that does not belong to user', async () => {
    await playlistDetailsPage.goto(1);
    await playlistDetailsPage.waitForPlaylistNameHeader();

    expect(await playlistDetailsPage.isDeleteButtonVisible()).toBe(false);
  });
});

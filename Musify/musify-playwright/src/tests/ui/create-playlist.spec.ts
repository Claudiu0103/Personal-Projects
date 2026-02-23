import { test, expect } from '@playwright/test';
import { CreatePlaylistPage } from '../../pages/create-playlist-page';
import { CreatePlaylistData } from '../../utils/interface';

let createPlaylistPage: CreatePlaylistPage;

test.use({ storageState: 'src/config/adminLoggedInState.json' });

test.beforeEach(async ({ page }) => {
  createPlaylistPage = new CreatePlaylistPage(page);
  await createPlaylistPage.goto();
});

test('Verify that user cannot submit empty name', async () => {
  await expect(createPlaylistPage['submitButton']).toBeDisabled();
});

test('Verify if user can create a PUBLIC playlist', async () => {
  const data: CreatePlaylistData = {
    name: 'Test Playlists',
    type: 'PUBLIC',
  };
  await createPlaylistPage.fillForm(data);
  await createPlaylistPage.submit();
  await createPlaylistPage.assertPlaylistCreated();
});

test('Verify if user can create a PRIVATE playlist', async () => {
  const data: CreatePlaylistData = {
    name: 'Test Playlist',
    type: 'PRIVATE',
  };
  await createPlaylistPage.fillForm(data);
  await createPlaylistPage.submit();
  await createPlaylistPage.assertPlaylistCreated();
});

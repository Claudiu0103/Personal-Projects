import { test } from '@playwright/test';
import { UpdateSongPage } from '../../pages/update-song';

test.describe('Update Song Tests', () => {

  test.use({ storageState: 'src/config/adminLoggedInState.json' });
  let updateSongPage: UpdateSongPage;

  test.beforeEach(async ({ page }) => {
    updateSongPage = new UpdateSongPage(page);
    await updateSongPage.goto(1);
    await updateSongPage.isTitleVisible();

  });

  test('Verify that user can update song successfully when all fields are valid', async () => {
    await updateSongPage.updateSong({
      title: 'Test Song Title',
      duration: '03:30',
      alternativeTitles: [
        { title: 'Versiune 1', language: 'RO' },
        { title: 'Version 2', language: 'EN' }
      ],
      artistIds: []
    });
  });

  test('Verify that user cannot update a song when the title field is empty', async () => {
    await updateSongPage.assertFieldError('title', '');
  });

  test('Verify that user cannot submit a song without specifying duration', async () => {
    await updateSongPage.assertFieldError('duration', 'Must be in MM:SS format.');
  });

  test('Verify that alternative title 2 and its language are saved correctly', async () => {
    await updateSongPage.fillAltTitleAndLang(2, 'Second Title', 'FR');
  });

});

import { test, expect } from '@playwright/test';
import { AlbumDetailsPage } from '../../pages/album-details';

const ALBUM_WITH_SONGS_ID = 4;
const ALBUM_WITHOUT_SONGS_ID = 40;

const expectedFirstSong = {
  title: 'Song D',
  artists: 'Rina, Neon Lights',
  duration: '05:00',
  number: '1',
};

const expectedAlbumDetails = {
  title: 'Album Four',
  description: 'Greatest hits',
  genre: 'classical',
  releaseDate: 'Jan 4, 2025',
  label: 'LabelD',
  artist: 'Rina',
};


test.describe('Album Details Page Tests - Admin user', () => {
  test.use({ storageState: 'src/config/adminLoggedInState.json' });

  let albumDetailsPage: AlbumDetailsPage;

  test.beforeEach(async ({ page }) => {
    albumDetailsPage = new AlbumDetailsPage(page);
  });

  test('Verify if admin can see correct album details and edit button with the correct text', async () => {
    await albumDetailsPage.goto(ALBUM_WITH_SONGS_ID);
    await albumDetailsPage.isTitleVisible();

    const details = await albumDetailsPage.getAlbumDetails();

    expect(details.title?.trim()).toBe(expectedAlbumDetails.title);
    expect(details.description?.trim()).toBe(expectedAlbumDetails.description);
    expect(details.genre?.trim()).toBe(expectedAlbumDetails.genre);
    expect(details.releaseDate?.trim()).toBe(expectedAlbumDetails.releaseDate);
    expect(details.label?.trim()).toBe(expectedAlbumDetails.label);

    expect(await albumDetailsPage.isEditButtonVisible()).toBe(true);
    expect(await albumDetailsPage.isEditButtonTextCorrect()).toBe(true);
  });


  test('Verify if the first song displayed matches the expected data', async () => {
    await albumDetailsPage.goto(ALBUM_WITH_SONGS_ID);
    await albumDetailsPage.isTitleVisible();

    const firstSong = await albumDetailsPage.getSongAt(0);

    expect(firstSong.title?.trim()).toBe(expectedFirstSong.title);
    expect(firstSong.artists?.trim()).toBe(expectedFirstSong.artists);
    expect(firstSong.duration?.trim()).toBe(expectedFirstSong.duration);
    expect(firstSong.number?.trim()).toBe(expectedFirstSong.number);

    expect(await albumDetailsPage.isSongsHeadingVisible()).toBe(true);
  });

  test('Verify if admin sees no songs message and no heading if album has no songs', async () => {
    await albumDetailsPage.goto(ALBUM_WITHOUT_SONGS_ID);
    await albumDetailsPage.isTitleVisible();
    expect(await albumDetailsPage.isNoSongsMessageVisible()).toBe(true);
    expect(await albumDetailsPage.isSongsHeadingVisible()).toBe(false);
  });

  test('Verify if clicking edit button navigates to edit album page', async ({ page }) => {
    await albumDetailsPage.goto(ALBUM_WITH_SONGS_ID);
    await albumDetailsPage.isTitleVisible();
    await albumDetailsPage.clickEdit();
    await expect(page).toHaveURL(new RegExp(`/albums/${ALBUM_WITH_SONGS_ID}/edit`));
  });
});

test.describe('Album Details Page Tests - Regular user', () => {
  test.use({ storageState: 'src/config/regularLoggedInState.json' });

  let albumDetailsPage: AlbumDetailsPage;

  test.beforeEach(async ({ page }) => {
    albumDetailsPage = new AlbumDetailsPage(page);
  });

  test('Verify if regular user can see album details but no edit button', async () => {
    await albumDetailsPage.goto(ALBUM_WITH_SONGS_ID);
    await albumDetailsPage.isTitleVisible();
    expect(await albumDetailsPage.isEditButtonVisible()).toBe(false);
  });
});

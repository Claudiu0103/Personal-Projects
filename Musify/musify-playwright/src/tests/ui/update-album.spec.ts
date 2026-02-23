import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UpdateAlbumData } from '../../utils/interface';
import { AlbumUpdatePage } from '../../pages/update-album';

const ALBUM_ID_TO_UPDATE = 2;

test.describe('Album Update Tests', () => {
  test.use({ storageState: 'src/config/adminLoggedInState.json' });

  let albumUpdatePage: AlbumUpdatePage;

  test.beforeEach(async ({ page }) => {
    albumUpdatePage = new AlbumUpdatePage(page);
    await albumUpdatePage.goto(ALBUM_ID_TO_UPDATE);
  });

  test('Verify if Admin can update album with random data, gets redirected and a success toast notification is displayed', async () => {
    const randomAlbum: UpdateAlbumData = {
      title: faker.music.songName(),
      description: faker.lorem.sentence(),
      genre: faker.music.genre(),
      releaseDate: faker.date.past().toISOString().split('T')[0],
      label: faker.company.name(),
    };

    await albumUpdatePage.fillForm(randomAlbum);
    await albumUpdatePage.submitForm();

    await albumUpdatePage.waitForSuccessToast();

    expect(await albumUpdatePage.isSuccessToastVisible()).toBe(true);
    const message = await albumUpdatePage.getSuccessToastMessage();
    expect(message).toContain('Album updated successfully');

    await expect(albumUpdatePage.getCurrentUrl()).resolves.toContain(`/albums/${ALBUM_ID_TO_UPDATE}`);
  });

  test('Verify if save button is disabled and error is shown when title is empty', async () => {
    await albumUpdatePage.clearField('title');
    await albumUpdatePage.waitForFieldError('title');

    expect(await albumUpdatePage.isSaveButtonDisabled()).toBe(true);
    expect(await albumUpdatePage.isFieldErrorVisible('title')).toBe(true);
  });

  test('Verify if save button is disabled and error is shown when genre is empty', async () => {
    await albumUpdatePage.clearField('genre');
    await albumUpdatePage.waitForFieldError('genre');

    expect(await albumUpdatePage.isSaveButtonDisabled()).toBe(true);
    expect(await albumUpdatePage.isFieldErrorVisible('genre')).toBe(true);
  });

  test('Verify if save button is disabled and error is shown when release date is empty', async () => {
    await albumUpdatePage.clearReleaseDateAndTriggerValidation();

    expect(await albumUpdatePage.isSaveButtonDisabled()).toBe(true);
    expect(await albumUpdatePage.isFieldErrorVisible('releaseDate')).toBe(true);
  });

  test('Verify if release date year has more than 4 digits and show validation error', async () => {
    const invalidDate = '12345-01-01';

    await albumUpdatePage.setInvalidReleaseDate(invalidDate);

    expect(await albumUpdatePage.isReleaseDatePatternErrorVisible()).toBe(true);

    expect(await albumUpdatePage.isSaveButtonDisabled()).toBe(true);
  });
});

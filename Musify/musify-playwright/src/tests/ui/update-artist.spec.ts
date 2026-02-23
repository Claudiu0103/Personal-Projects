import { test, expect } from '@playwright/test';
import { UpdateArtistPage } from '../../pages/update-artist';
import { UpdateArtistData } from '../../utils/interface';

test.describe('Update Artist Tests', () => {

  test.use({ storageState: 'src/config/adminLoggedInState.json' });
  let updateArtistPage: UpdateArtistPage;


  test.beforeEach(async ({ page }, testInfo) => {
    updateArtistPage = new UpdateArtistPage(page);

    const artistId = testInfo.title.toLowerCase().includes('band') ? 2 : 1;
    await updateArtistPage.goto(artistId);
    await updateArtistPage.validateFormSectionVisibility();

  });


  test('Verify if user can successfully update artist with type PERSON with valid data', async () => {

    const data: UpdateArtistData =
    {
      type: 'Person',
      startDate: { year: '2000', month: '01', day: '01' },
      personDetails:
      {
        firstName: 'Updated',
        lastName: 'Person',
        stageName: 'UP',
        birthDate: '1995-05-10'
      },
      endDate: { year: '2024', month: '08', day: '01' }
    };

    await updateArtistPage.updateArtist(data);
  });

  test('Verify if user can successfully update artist with type BAND with valid data', async () => {

    const data: UpdateArtistData =
    {
      type: 'Band',
      startDate: { year: '2010', month: '03', day: '15' },
      bandDetails:
      {
        bandName: 'New Band Name',
        location: 'New York',
        members: ['John Doe']
      },
      endDate: { year: '2025', month: '12', day: '31' }
    };

    await updateArtistPage.updateArtist(data);
  });

  test('Verify if user can\'t update artist with type PERSON if first name field is empty', async ({ page }) => {
    await updateArtistPage.goto(1);
    await updateArtistPage.assertFieldError('firstName', 'First Name is required');
  });

  test('Verify if user can\'t update artist with type PERSON if last name field is empty', async ({ page }) => {
    await updateArtistPage.goto(1);
    await updateArtistPage.assertFieldError('lastName', 'Last Name is required');
  });

  test('Verify if user can\'t update artist with type PERSON if stage name field is empty', async ({ page }) => {
    await updateArtistPage.goto(1);
    await updateArtistPage.assertFieldError('stageName', 'Stage Name is required');
  });

  test('Verify if user can\'t update artist with type PERSON if birth date field is empty', async ({ page }) => {
    await updateArtistPage.goto(1);
    await updateArtistPage.assertFieldError('birthday', 'Birth Date is required');
  });

  test('Verify if user can\'t update artist with type BAND if band name field is empty', async ({ page }) => {
    await updateArtistPage.goto(2);
    await updateArtistPage.assertFieldError('bandName', 'Band Name is required');
  });

  test('Verify if user can\'t update artist with type BAND if location field is empty', async ({ page }) => {
    await updateArtistPage.goto(2);
    await updateArtistPage.assertFieldError('location', 'Location is required');
  });
});

import { test, expect } from '@playwright/test';
import { CreateArtistPage } from '../../pages/create-artist';
import { CreateArtistData } from '../../utils/interface';

let createArtistPage: CreateArtistPage;

test.use({ storageState: 'src/config/adminLoggedInState.json' });

test.describe('Create Artist Page Tests', () => {

  test.beforeEach(async ({ page }) => {
    createArtistPage = new CreateArtistPage(page);
    await createArtistPage.goto();
    createArtistPage.isTypeVisible()
  });

  test('Verify if user can successfully create a Person artist', async () => {
    const artistData: CreateArtistData = {
      type: 'Person',
      startDate: { year: '2020', month: '01', day: '01' },
      personDetails: {
        firstName: 'Test',
        lastName: 'Smith',
        stageName: 'J-Smith',
        birthDate: '1990-01-01'
      }
    };

    await createArtistPage.fillForm(artistData);
    await createArtistPage.submit();
    await createArtistPage.assertArtistCreated();

  });

  test('Verify if user can successfully create a Band artist', async () => {
    const artistData: CreateArtistData = {
      type: 'Band',
      startDate: { year: '2015', month: '05', day: '12' },
      endDate: { year: '2022', month: '07', day: '01' },
      bandDetails: {
        bandName: 'Test',
        location: 'New York',
        members: []
      }
    };

    await createArtistPage.fillForm(artistData);
    await createArtistPage.submit();
    await createArtistPage.assertArtistCreated();
  });


  test('Verify that artist cannot be created with empty required fields', async ({ page }) => {
    const artistData: CreateArtistData = {
      type: 'Person',
      startDate: { year: '', month: '', day: '' },
      personDetails: {
        firstName: '',
        lastName: '',
        stageName: '',
        birthDate: ''
      }
    };

    await createArtistPage.assertCannotCreateWithEmptyFields(artistData);
  });

  test('Verify that user sees error when band name is only whitespace', async ({ page }) => {
    const artistData: CreateArtistData = {
      type: 'Band',
      startDate: { year: '2010', month: '10', day: '10' },
      bandDetails: {
        bandName: '   ',
        location: '   ',
        members: []
      }
    };

    await createArtistPage.assertCannotCreateBandWithWhitespaces(artistData);
  });
});
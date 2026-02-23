import { expect, test } from '@playwright/test';
import { CreateAlbumPage } from '../../pages/create-album';
import { CreateAlbumData } from '../../utils/interface';


test.use({ storageState: 'src/config/adminLoggedInState.json' });

test.describe('Create Album Page Tests', () => {
    let createAlbumPage: CreateAlbumPage;

    test.beforeEach(async ({ page }) => {
        createAlbumPage = new CreateAlbumPage(page);
        await createAlbumPage.goto();
        createAlbumPage.isTitleVisible()
    });

    test('Verify if user is able to create an album successfully', async ({ page }) => {
        const albumData: CreateAlbumData = {
            title: 'Test',
            description: 'This is a test album.',
            genre: 'Rock',
            releaseDate: '2025-07-01',
            label: 'Test Label',
            artistName: 'The Rockets',
            songs: []
        };

        await createAlbumPage.assertAlbumCreated(albumData);
    });

    test('Verify if user is not able to create album with invalid input (spaces only)', async ({ page }) => {
        const albumData: CreateAlbumData = {
            title: 'Test',
            description: '   ',
            genre: '   ',
            releaseDate: '   ',
            label: '   ',
            artistName: '',
            songs: []
        };

        await createAlbumPage.assertCannotCreateAlbumWithEmptyFields(albumData);
    });

    test('Verify if user is not able to create album with future release date', async ({ page }) => {

        const albumData: CreateAlbumData = {
            title: 'Test',
            description: 'Testing future date restriction.',
            genre: 'Electronic',
            releaseDate: '2100-01-01',
            label: 'Time Travelers Records',
            artistName: 'The Rockets',
            songs: []
        };

        await createAlbumPage.assertCannotCreateAlbumWithFutureDate(albumData)
    });
});
import { expect, test } from '@playwright/test';
import { CreateSongPage } from '../../pages/create-song';

test.use({ storageState: './src/config/adminLoggedInState.json' });

test.describe('Create Song Page Tests', () => {
    let createSongPage: CreateSongPage;

    test.beforeEach(async ({ page }) => {
        createSongPage = new CreateSongPage(page);
        await createSongPage.goto();
        await createSongPage.isTitleVisible();
    })

    test('Verify if user can successfully create song with valid input data', async () => {
        await createSongPage.createSong({
            title: 'TestSongTitle',
            duration: '04:12',
            alternativeTitles: [
                {
                    title: 'TestSongAltTitle',
                    language: 'TestSongAltTitleLanguage'
                }
            ],
            artistIds: []
        });
    });

    test('Verify if user is not able to create song with empty title', async () => {
        await createSongPage.assertError('title', 'Title is required');
    });

    test('Verify if user is not able to create song with empty duration', async () => {
        await createSongPage.assertError('duration', 'Duration is required (must be in MM:SS format)');
    });

    test('Verify if user is not able to create song with invalid duration', async () => {
        await createSongPage.fillInvalidDuration();
        await createSongPage.assertError('duration', 'Duration is required (must be in MM:SS format)');
    });
});
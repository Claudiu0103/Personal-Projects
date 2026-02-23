import { test, expect } from '@playwright/test';
import { SongPage } from '../../pages/songs-page';

test.describe("Songs Page Tests", () => {
    test.use({ storageState: './src/config/regularLoggedInState.json' });
    let songPage: SongPage;

    test.beforeEach(async ({ page }) => {
        songPage = new SongPage(page);
        await songPage.goto();
        await songPage.waitForFirstSongCard();
    });

    test('Verify if song page title is visible', async () => {
        expect(await songPage.isTitleVisible()).toBe(true);
    });

    test('Verify if song cards are listed and visible', async () => {
        expect(await songPage.areSongCardsVisible()).toBe(true);
    });

    test('Verify if song card is clickable', async () => {
        const count = await songPage.getSongCardCount();
        await songPage.clickSongCard(1);
    });
});

test.describe('Verify expanded song card modal for admin', () => {
    test.use({ storageState: './src/config/adminLoggedInState.json' });
    let songPage: SongPage;

    test.beforeEach(async ({ page }) => {
        songPage = new SongPage(page);
        await songPage.goto();
        await songPage.waitForFirstSongCard();
    });

    test('Verify if modal opens on song card click and shows correct buttons for admin', async () => {
        const count = await songPage.getSongCardCount();
        expect(count).toBeGreaterThan(0);
        await songPage.clickSongCard(0);
        expect(await songPage.isModalVisible()).toBe(true);
        expect(await songPage.isAddToPlaylistVisible()).toBe(true);
        expect(await songPage.isEditVisible()).toBe(true);
    });
});

test.describe('Verify expanded song card modal for regular user', () => {
    test.use({ storageState: './src/config/regularLoggedInState.json' });
    let songPage: SongPage;

    test.beforeEach(async ({ page }) => {
        songPage = new SongPage(page);
        await songPage.goto();
        await songPage.waitForFirstSongCard();
    });

    test('Verify if modal opens on song card click and shows correct buttons for regular user', async () => {
        const count = await songPage.getSongCardCount();
        expect(count).toBeGreaterThan(0);
        await songPage.clickSongCard(0);
        expect(await songPage.isModalVisible()).toBe(true);
        expect(await songPage.isAddToPlaylistVisible()).toBe(true);
        expect(await songPage.isEditVisible()).toBe(false);
    });
});
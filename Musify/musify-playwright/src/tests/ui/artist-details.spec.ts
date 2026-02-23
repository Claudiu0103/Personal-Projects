import { test, expect } from '@playwright/test';
import { MockData } from '../../utils/mock-data';
import { ArtistDetailPage } from '../../pages/artist-details';

test.use({ storageState: './src/config/regularLoggedInState.json' });

test.describe('Artist Detail Page Tests', () => {
    let artistDetailPage: ArtistDetailPage;

    test.beforeEach(async ({ page }) => {
        artistDetailPage = new ArtistDetailPage(page);
    });

    test.describe('Detail Section Tests', () => {

        test('Verify if edit button is not visible for regular user', async ({ page }) => {
            await page.route('**/api/artists/1', (route) => {
                route.fulfill({
                    status: 200,
                    body: JSON.stringify(MockData.mockPersonArtist),
                    contentType: 'application/json'
                });
            });

            await artistDetailPage.goto('1');
            await artistDetailPage.expectEditButtonNotVisible();
        });

        test.describe('Person Artist Tests', () => {
            test.beforeEach(async ({ page }) => {

                await page.route('**/api/artists/1', (route) => {
                    route.fulfill({
                        status: 200,
                        body: JSON.stringify(MockData.mockPersonArtist),
                        contentType: 'application/json'
                    });
                });

                await artistDetailPage.goto('1');
            });

            test('Verify if person artist basic info is correctly displayed', async () => {
                await artistDetailPage.expectArtistNameVisible();
                const name = await artistDetailPage.getArtistName();
                expect(name).toBe('John Doe');

                const meta = await artistDetailPage.getArtistMeta();
                expect(meta.toLowerCase()).toContain('person');
            });

            test('Verify if person details section is visible and functional', async () => {
                await artistDetailPage.expectPersonDetailsVisible();

                await artistDetailPage.expectPersonInfoCollapsed();

                await artistDetailPage.togglePersonDetails();
                await artistDetailPage.expectPersonInfoExpanded();

                const details = await artistDetailPage.getPersonDetails();
                expect(details.firstName).toContain('John');
                expect(details.lastName).toContain('Doe');
                expect(details.birthday).toContain('15/05/1990');
            });

        });

        test.describe('Band Artist Tests', () => {
            test.beforeEach(async ({ page }) => {
                await page.route('**/api/artists/2', (route) => {
                    route.fulfill({
                        status: 200,
                        body: JSON.stringify(MockData.mockBandArtist),
                        contentType: 'application/json'
                    });
                });

                await artistDetailPage.goto('2');
            });

            test('Verify if band artist basic info is correctly displayed', async () => {
                await artistDetailPage.expectArtistNameVisible();
                const name = await artistDetailPage.getArtistName();
                expect(name).toBe('The Rock Stars');

                const meta = await artistDetailPage.getArtistMeta();
                expect(meta.toLowerCase()).toContain('band');
            });

            test('Verify if band details section is visible and functional', async () => {
                await artistDetailPage.expectBandDetailsVisible();

                await artistDetailPage.expectBandInfoCollapsed();

                await artistDetailPage.toggleBandDetails();
                await artistDetailPage.expectBandInfoExpanded();

                const location = await artistDetailPage.getBandLocation();
                expect(location).toContain('New York');

                const memberCount = await artistDetailPage.getBandMemberCount();
                expect(memberCount).toBe(2);

                const firstMember = await artistDetailPage.getBandMemberInfo(0);
                expect(firstMember.stageName).toContain('Johnny Rock');
                expect(firstMember.firstName).toContain('John');
            });

        });
    })

    test.describe('Albums Section Tests', () => {
        test.beforeEach(async ({ page }) => {

            await page.route('**/api/artists/1/albums', (route) => {
                route.fulfill({
                    status: 200,
                    body: JSON.stringify(MockData.mockAlbums),
                    contentType: 'application/json'
                });
            });

            await artistDetailPage.goto('1');
        });

        test('Verify if albums section is visible and correct data is displayed', async () => {
            await artistDetailPage.expectAlbumsVisible();

            const albumCount = await artistDetailPage.getAlbumCount();
            expect(albumCount).toBe(2);

            const firstAlbum = await artistDetailPage.getAlbumInfo(0);
            expect(firstAlbum.title).toBe('Greatest Hits');
            expect(firstAlbum.genre).toBe('Rock');
            expect(firstAlbum.artist).toBe('John Doe');
        });

        test('Verify if clicking on album navigates user to album details page', async ({ page }) => {
            await artistDetailPage.clickAlbumCard(0);
            await expect(page).toHaveURL(/\/albums\/[^\/]+$/);
        });

        test('Verify if albums are not visible when no albums are present', async ({ page }) => {
            await page.route('**/api/artists/1/albums', (route) => {
                route.fulfill({
                    status: 200,
                    body: JSON.stringify([]),
                    contentType: 'application/json'
                });
            });

            await artistDetailPage.goto('1');
            await artistDetailPage.expectAlbumsNotVisible();
        });
    });

    test.describe('Songs Section Tests', () => {
        test.beforeEach(async ({ page }) => {

            await page.route('**/api/artists/1/songs', (route) => {
                route.fulfill({
                    status: 200,
                    body: JSON.stringify(MockData.mockArtistSongs),
                    contentType: 'application/json'
                });
            });

            await artistDetailPage.goto('1');
        });

        test('Verify if songs section is visible and correct data is displayed', async () => {
            await artistDetailPage.expectSongsVisible();

            const songCount = await artistDetailPage.getSongCount();
            expect(songCount).toBe(2);

            const firstSong = await artistDetailPage.getSongInfo(0);
            expect(firstSong.number).toBe('1');
            expect(firstSong.title).toBe('Hit Song 1');
            expect(firstSong.artists).toBe('John Doe');
            expect(firstSong.duration).toBe('3:45');
        });

        test('Verify if songs are not visible when no songs are present', async ({ page }) => {
            await page.route('**/api/artists/1/songs', (route) => {
                route.fulfill({
                    status: 200,
                    body: JSON.stringify([]),
                    contentType: 'application/json'
                });
            });

            await artistDetailPage.goto('1');
            await artistDetailPage.expectSongsNotVisible();
        });
    });

    test.describe('Admin Tests', () => {
        test.use({ storageState: './src/config/adminLoggedInState.json' });

        test.beforeEach(async ({ page }) => {
            await page.route('**/api/artists/1', (route) => {
                route.fulfill({
                    status: 200,
                    body: JSON.stringify(MockData.mockPersonArtist),
                    contentType: 'application/json'
                });
            });

            await artistDetailPage.goto('1');
        })

        test('Verify if edit button is visible for admin', async () => {
            await artistDetailPage.expectEditButtonVisible();
        });

        test('Verify if clicking edit button navigates user to edit artist page', async ({ page }) => {
            await artistDetailPage.expectEditButtonVisible();
            await artistDetailPage.clickEditButton();
            await expect(page).toHaveURL(/\/artist\/1\/edit$/);
        });
    });
});
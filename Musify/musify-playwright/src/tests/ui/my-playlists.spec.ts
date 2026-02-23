import test, { expect, Page } from "@playwright/test";
import { MyPlaylistsPage } from "../../pages/my-playlists-page";

test.use({ storageState: './src/config/adminLoggedInState.json' });

test.describe('My Playlists Page Tests', () => {
    let page: Page;
    let myPlaylistsPage: MyPlaylistsPage;

    test.beforeEach(async ({ page: p }) => {
        page = p;
        myPlaylistsPage = new MyPlaylistsPage(page);

        await myPlaylistsPage.goto();
    });

    test('Verify if both followed and owned playlists sections are visible', async () => {
    
        await myPlaylistsPage.assertFollowedSectionIsVisible();
        await myPlaylistsPage.assertPlaylistCardIsVisible(15); 
        await myPlaylistsPage.assertPlaylistCardIsVisible(17); 

        await myPlaylistsPage.assertOwnedSectionIsVisible();
        await myPlaylistsPage.assertPlaylistCardIsVisible(21);
    });

    test('Verify if message "library is empty" is displayed for a new user', async ({ browser }) => {
        const newUserContext = await browser.newContext({ storageState: './src/config/regularLoggedInState.json' });
        const newUserPage = await newUserContext.newPage();
        const newUserPlaylistsPage = new MyPlaylistsPage(newUserPage);

        await newUserPlaylistsPage.goto();

        await newUserPlaylistsPage.assertNoFollowedMessageIsVisible();
        await newUserPlaylistsPage.assertNoOwnedMessageIsVisible();
        await newUserPlaylistsPage.assertSectionIsHidden('followed');
        await newUserPlaylistsPage.assertSectionIsHidden('owned');

        await newUserContext.close();
    });

    test('Verify the navigation to playlist details when a card is clicked', async () => {
        const playlistIdToClick = 17;
        await myPlaylistsPage.assertPlaylistCardIsVisible(playlistIdToClick);
        await myPlaylistsPage.clickPlaylistCard(playlistIdToClick);

        await expect(page).toHaveURL(`/playlists/${playlistIdToClick}`);
    });
});


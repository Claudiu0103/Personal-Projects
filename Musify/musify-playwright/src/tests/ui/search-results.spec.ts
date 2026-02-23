import test, { expect, Page } from "@playwright/test";
import { SearchPage } from "../../pages/search-page";


test.use({ storageState: './src/config/adminLoggedInState.json' });

test.describe('Search Results Tests', () => {
    let searchPage: SearchPage;
    let page: Page;
    
    test.beforeEach(async ({ page: p }) => {
        page = p;
        searchPage = new SearchPage(page);
    });

    test('Verify if display categorized results fot a valid query', async () => {
        const query = 'one';

        await searchPage.gotoWithQuery(query);
        await searchPage.assertPageTitleIsVisible(query);

        await searchPage.assertSectionIsVisible('albums');
        await searchPage.assertCardWithIdIsVisible('album', 1); 
        await searchPage.assertCardWithIdIsVisible('album', 36); 
    });

    test('Verify if display a "no results" message', async () => {
        const query = 'invalidQuery12398fh';
        await searchPage.gotoWithQuery(query);
        await searchPage.assertNoResultsFoundMessageIsVisible(query);

        await searchPage.assertSectionIsHidden('songs');
        await searchPage.assertSectionIsHidden('albums');
        await searchPage.assertSectionIsHidden('artists');
    });

    test('Verify if navigate to album details page', async () => {
        await searchPage.gotoWithQuery('one');
        await searchPage.assertCardWithIdIsVisible('album', 1);

        await searchPage.clickOnCardById('album', 1);
        await expect(page).toHaveURL(/\/albums\/\d+/); 
    });

    test('Verify if shows song details modal when user select a song card', async () => {
        await searchPage.gotoWithQuery('song');
        await searchPage.assertCardWithIdIsVisible('song', 1);

        await searchPage.openSongDetailsFromCard(1);
    });

});

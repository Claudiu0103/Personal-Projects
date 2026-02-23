import test, { expect } from "@playwright/test";
import { SearchBarPage } from "../../pages/search-bar-page";
import { HomePage } from "../../pages/home-page";

test.use({ storageState: './src/config/regularLoggedInState.json' });

test.describe('Search bar Preview Functionality', () => {
    let searchBar: SearchBarPage;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        searchBar = new SearchBarPage(page);
        await homePage.goto();
    });

    test('Verify if display preview results for a valid query', async () => {
        await searchBar.search({ query: 'rock' });

        await searchBar.assertItemIsVisibleInPreview('The Rockets');
    });

    test('Verify if show "no results" message for a query with no matches', async () => {
        await searchBar.search({ query: 'asdboasdewq' });
        await searchBar.assertNoResultsFound();
    });

    test('Verify if clear the search and hide preview when clean button is clicked', async () => {
        await searchBar.search({ query: 'song' });
        await searchBar.clearSearch();
    })

    test('Verify if navigate to the full search page when "Show all results" is clicked', async ({ page }) => {
        await searchBar.search({ query: 'one' });
        await searchBar.clickShowAllResults();

        await expect(page).toHaveURL(`/searchResults?q=one`);
    });
});


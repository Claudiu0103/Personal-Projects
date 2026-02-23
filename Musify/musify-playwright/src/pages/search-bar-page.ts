import { expect, Locator, Page } from "@playwright/test";
import { SearchData } from "../utils/interface";
import { Timeouts } from "../utils/timeouts";

export class SearchBarPage {

    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            searchInput: this.page.locator('input[name="search"]'),
            clearButton: this.page.locator('[name="clear-search-button"]'),
            resultsOverlay: this.page.locator('[name="search-results-overlay"]'),
            showAllButton: this.page.locator('[name="show-all-results-button"]'),
            noResultsMessage: this.page.locator('[name="no-results-message"]')
        };
    }

    private getResultItemLocatorByName(itemName: string): Locator {
        return this.fieldMap.resultsOverlay.locator('a').filter({ hasText: itemName }).first();
    }

    async search(searchData: SearchData): Promise<void> {
        await this.fieldMap.searchInput.fill(searchData.query);
        await expect(this.fieldMap.resultsOverlay).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }

    async clearSearch(): Promise<void> {
        await this.fieldMap.clearButton.click();
        await expect(this.fieldMap.resultsOverlay).toBeHidden();
        await expect(this.fieldMap.searchInput).toBeEmpty();
    }

    async clickShowAllResults(): Promise<void> {
        await this.fieldMap.showAllButton.click();
    }

    async assertItemIsVisibleInPreview(name: string): Promise<void> {
        const item = this.getResultItemLocatorByName(name);
        await expect(item).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }

    async clickOnSearchResult(name: string): Promise<void> {
        const item = this.getResultItemLocatorByName(name);
        await item.click();
    }

    async assertNoResultsFound(): Promise<void> {
        await expect(this.fieldMap.noResultsMessage).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }
}
import { expect, Locator, Page } from "@playwright/test";
import { Timeouts } from "../utils/timeouts";

export class SearchPage {

    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            pageTitle: this.page.locator('[name="results-title"]'),
            songsSection: this.page.locator('[name="songs-section"]'),
            artistsSection: this.page.locator('[name="artists-section"]'),
            albumsSection: this.page.locator('[name="albums-section"]'),
            noResultsMessage: this.page.locator('[name="no-results-message"]'),
            songDetailsModal: page.locator('[name="song-details-modal"]'),
        }
    }

    private getCardLocator(type: 'song' | 'artist' | 'album', id: number): Locator {
        return this.page.locator(`[name="${type}-card-${id}"]`);
    }

    async gotoWithQuery(query: string): Promise<void> {
        await this.page.goto(`/searchResults?q=${query}`);
    }

    async assertPageTitleIsVisible(query: string): Promise<void> {
        await expect(this.fieldMap.pageTitle).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
        await expect(this.fieldMap.pageTitle).toContainText(`Results for "${query}"`);
    }

    async assertSectionIsVisible(sectionName: 'songs' | 'artists' | 'albums'): Promise<void> {
        await expect(this.fieldMap[`${sectionName}Section`]).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }

    async assertSectionIsHidden(sectionName: 'songs' | 'artists' | 'albums'): Promise<void> {
        await expect(this.fieldMap[`${sectionName}Section`]).toBeHidden();
    }

    async assertCardWithIdIsVisible(type: 'song' | 'artist' | 'album', id: number): Promise<void> {
        const card = this.getCardLocator(type, id);
        await expect(card).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }

    async clickOnCardById(type: 'song' | 'artist' | 'album', id: number): Promise<void> {
        const card = this.getCardLocator(type, id);
        await card.click();
    }

    async assertNoResultsFoundMessageIsVisible(query: string): Promise<void> {
        await expect(this.fieldMap.noResultsMessage).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
        await expect(this.fieldMap.noResultsMessage).toContainText(`No results found for "${query}"`);
    }

    async openSongDetailsFromCard(songId: number): Promise<void> {
        const songCard = this.getCardLocator('song', songId);
        await songCard.click();
        await this.page.waitForResponse(resp => resp.url().includes('/api/songs/') && resp.status() === 200);
        await this.fieldMap.songDetailsModal.waitFor({
            state: 'attached',
            timeout: Timeouts.MEDIUM_TIMEOUT
        });
    }

    async assertSongDetailsModalContainsText(text: string): Promise<void> {
        await expect(this.fieldMap.songDetailsModal).toContainText(text);
    }

}
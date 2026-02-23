import { Page, Locator, expect } from '@playwright/test';

export class SongPage {
    private readonly page: Page;
    private readonly songCards: Locator;
    private readonly titleInput: Locator;
    private readonly addToPlaylistButton: Locator;
    private readonly modal: Locator;
    private readonly editButton: Locator;
    private readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleInput = this.page.locator('h2', { hasText: 'Songs' });
        this.songCards = this.page.locator('.song-card');
        this.addToPlaylistButton = this.page.locator('button:has-text("Add to Playlist")');
        this.modal = this.page.locator('.modal-content');
        this.editButton = this.page.locator('button:has-text("Edit")');
        this.closeButton = this.page.locator('.close-btn');
    }

    async goto(): Promise<void> {
        await this.page.goto('/songs');
    }

    async titleInputVisible() {
        await expect(this.titleInput).toBeVisible();
    }

    async getSongCardInfo(index: number): Promise<{ title: string; duration: string; albumName: string; artistName: string }> {
        const card = this.songCards.nth(index);
        return {
            title: await card.locator('h3.text-fitting').innerText(),
            duration: await card.locator('p.duration').innerText(),
            albumName: await card.locator('.album text-fitting').innerText(),
            artistName: await card.locator('.artists text-fitting').innerText(),
        };
    }

    async clickSongCard(index: number): Promise<void> {
        await this.songCards.nth(index).click();
        await this.page.waitForSelector('.modal-content', { state: 'visible' });
    }

    async isTitleVisible(): Promise<boolean> {
        return await this.titleInput.isVisible();
    }

    async areSongCardsVisible(): Promise<boolean> {
        return await this.songCards.first().isVisible();
    }

    async getSongCardCount(): Promise<number> {
        return await this.songCards.count();
    }

    async isModalVisible(): Promise<boolean> {
        return await this.modal.isVisible();
    }

    async isAddToPlaylistVisible(): Promise<boolean> {
        return await this.addToPlaylistButton.isVisible();
    }

    async isEditVisible(): Promise<boolean> {
        return await this.editButton.isVisible();
    }

    async waitForFirstSongCard(): Promise<void> {
    await expect(this.songCards.first()).toBeVisible();
    }


}


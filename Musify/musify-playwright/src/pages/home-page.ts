import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            profileIcon: this.page.locator('mat-icon', { hasText: 'account_circle' }),
            profileButton: this.page.locator('button', { hasText: 'Profile' }),
            logoutButton: this.page.locator('button', { hasText: 'Logout' }),
            songCards: this.page.locator('app-song-card'),
            artistCards: this.page.locator('app-artist-card'),
            albumCards: this.page.locator('app-album-card'),
            playlistCards: this.page.locator('app-playlist-card'),
            songDetailsModal: this.page.locator('app-song-details-modal'),
            songDetailsModalTitle: this.page.locator('app-song-details-modal h2.text-fitting')
        };
    }

    async goto(): Promise<void> {
        await this.page.goto('/home');
    }

    async profileIconVisible() {
        await expect(this.fieldMap.profileIcon).toBeVisible();
    }

    async logout() {
        await this.fieldMap.profileIcon.click();
        await this.fieldMap.logoutButton.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async openProfileModal(): Promise<void> {
        await this.fieldMap.profileIcon.click();
        await this.fieldMap.profileButton.click();
    }

    async mostWantedSongsDisplayed(): Promise<void> {
        await this.page.waitForFunction(() => !!document.querySelector('app-song-card'), null);
        await expect(this.fieldMap.songCards.first()).toBeVisible();

        const count = await this.fieldMap.songCards.count();
        expect(count).toBeGreaterThan(0);
    }

    async yourFavoriteArtistsDisplayed(): Promise<void> {
        await this.page.waitForFunction(() => !!document.querySelector('app-artist-card'), null);
        await expect(this.fieldMap.artistCards.first()).toBeVisible();

        const count = await this.fieldMap.artistCards.count();
        expect(count).toBeGreaterThan(0);
        await expect(this.fieldMap.artistCards.first()).toBeVisible();
    }

    async hotAlbumsDisplayed(): Promise<void> {
        await this.page.waitForFunction(() => !!document.querySelector('app-album-card'), null);
        await expect(this.fieldMap.albumCards.first()).toBeVisible();

        const count = await this.fieldMap.albumCards.count();
        expect(count).toBeGreaterThan(0);
        await expect(this.fieldMap.albumCards.first()).toBeVisible();
    }

    async topPlaylistsDisplayed(): Promise<void> {
        await this.page.waitForFunction(() => !!document.querySelector('app-playlist-card'), null);
        await expect(this.fieldMap.playlistCards.first()).toBeVisible();

        const count = await this.fieldMap.playlistCards.count();
        expect(count).toBeGreaterThan(0);
        await expect(this.fieldMap.playlistCards.first()).toBeVisible();
    }

    async clickFirstSongCard(): Promise<string> {
        const firstCard = this.fieldMap.songCards.first();
        const cardTitleLocator = firstCard.locator('h3.text-fitting');
        const cardTitle = (await cardTitleLocator.textContent())?.trim() ?? '';
        await firstCard.click();
        return cardTitle;
    }

    async expectCorrectModalOpen(titleFromCard: string): Promise<void> {
        const titleFromModal = await this.fieldMap.songDetailsModalTitle.textContent();
        await this.fieldMap.songDetailsModal.waitFor({ state: 'attached' });
        expect(titleFromCard).toBe(titleFromModal);
    }
}
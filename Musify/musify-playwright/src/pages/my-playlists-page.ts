import { expect, Locator, Page } from "@playwright/test";
import { Timeouts } from "../utils/timeouts";

export class MyPlaylistsPage {

    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            createPlaylistButton: this.page.locator('[name="create-playlist-button"]'),
            followedSection: this.page.locator('[name="followed-playlists-section"]'),
            ownedSection: this.page.locator('[name="owned-playlists-section"]'),
            noFollowedMessage: this.page.locator('[name="no-followed-message"]'),
            noOwnedMessage: this.page.locator('[name="no-owned-message"]')
        };
    }

    async goto(): Promise<void> {
        await this.page.goto('/playlists/me/playlists');
        await this.page.waitForSelector('.followed-playlists-page');
    }

    getPlaylistCard(playlistId: number): Locator {
        return this.page.locator(`[name="playlist-card-${playlistId}"]`);
    }

    async assertFollowedSectionIsVisible(): Promise<void> {
        await expect(this.fieldMap.followedSection).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }

    async assertOwnedSectionIsVisible(): Promise<void> {
        await expect(this.fieldMap.ownedSection).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }

    async assertSectionIsHidden(sectionName: 'followed' | 'owned'): Promise<void> {
        await expect(this.fieldMap[`${sectionName}Section`]).toBeHidden();
    }

    async assertPlaylistCardIsVisible(playlistId: number): Promise<void> {
        const card = this.getPlaylistCard(playlistId);
        await expect(card).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }

    async clickPlaylistCard(playlistId: number): Promise<void> {
        const card = this.getPlaylistCard(playlistId);
        await card.click();
    }

    async assertNoFollowedMessageIsVisible(): Promise<void> {
        await expect(this.fieldMap.noFollowedMessage).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }

    async assertNoOwnedMessageIsVisible(): Promise<void> {
        await expect(this.fieldMap.noOwnedMessage).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }
}
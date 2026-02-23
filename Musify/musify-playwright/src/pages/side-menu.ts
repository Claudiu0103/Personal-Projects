import { Page, Locator, expect } from '@playwright/test';

export class SideMenuPage {
    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            home: this.page.locator('a', { hasText: 'Home' }),
            songs: this.page.locator('a', { hasText: 'Songs' }),
            artists: this.page.locator('a', { hasText: 'Artists' }),
            albums: this.page.locator('a', { hasText: 'Albums' }),
            playlists: this.page.locator('a', { hasText: 'Playlists' }),
            createSong: this.page.locator('a', { hasText: 'Create Song' }),
            createArtist: this.page.locator('a', { hasText: 'Create Artist' }),
            createAlbum: this.page.locator('a', { hasText: 'Create Album' }),
            userDashboard: this.page.locator('a', { hasText: 'User Dashboard' })
        };
    }

    async goto(): Promise<void> {
        await this.page.goto('/home');
    }

    async homeButtonVisible() {
        await expect(this.fieldMap.home).toBeVisible();
    }

    async expectMenuItemVisible(item: keyof SideMenuPage['fieldMap']) {
        await expect(this.fieldMap[item]).toBeVisible();
    }

    async expectMenuItemHidden(item: keyof SideMenuPage['fieldMap']) {
        await expect(this.fieldMap[item]).toBeHidden();
    }

    async navigateTo(item: keyof SideMenuPage['fieldMap']) {
        await this.fieldMap[item].click();
        const regex = new RegExp(item, 'i');
        await expect(this.page).toHaveURL(regex);
    }
}
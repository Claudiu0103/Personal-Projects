import { Page, Locator, expect } from '@playwright/test';

export class ArtistsPage {
  private readonly page: Page;
  private readonly title: Locator;
  private readonly artistCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h2', { hasText: 'Artists' });
    this.artistCards = page.locator('.artist-card-list app-artist-card');
  }

  async goto(): Promise<void> {
    await this.page.goto('/artists');
  }

  async isTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  async clickFirstArtistCard() {
    await this.artistCards.first().click();
  }

  async numberOfArtists(): Promise<number> {
    await this.page.waitForFunction(() => !!document.querySelector('app-artist-card'), null);
    await expect(this.artistCards.first()).toBeVisible();

    return await this.artistCards.count();
  }

  async getArtistCardInfo(index: number): Promise<{ type: string; name: string }> {
    const card = this.artistCards.nth(index);
    return {
      name: await card.locator('h3.text-fitting').innerText(),
      type: await card.locator('p').innerText(),
    };
  }
}

import { Page, Locator, expect } from '@playwright/test';

export class AlbumPage {
  readonly page: Page;
  readonly albumCards: Locator;
  readonly emptyMessage: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h2', { hasText: 'Albums' });
    this.albumCards = page.locator('.album-card');
    this.emptyMessage = page.locator('p', { hasText: 'List is empty' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/albums');
  }

  async isTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  async getAlbumCardInfo(index: number): Promise<{ title: string; genre: string; artist: string; releaseDate: string }> {
    const card = this.albumCards.nth(index);
    return {
      title: await card.locator('h3.text-fitting').innerText(),
      genre: await card.locator('p.genre').innerText(),
      artist: await card.locator('p.artist').innerText(),
      releaseDate: await card.locator('p.release-date').innerText(),
    };
  }

  async clickAlbumCard(index: number): Promise<void> {
    await this.albumCards.nth(index).click();
  }
}

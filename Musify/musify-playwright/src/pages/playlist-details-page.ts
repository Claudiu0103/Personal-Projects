import { Page, Locator } from '@playwright/test';

export class PlaylistDetailsPage {
  readonly page: Page;
  readonly songCards: Locator;
  constructor(page: Page) {
    this.page = page;
    this.songCards = page.locator('.song-card');
  }
  async countSongs() {
    return this.songCards.count();
  }
}
import { Page, Locator, expect } from '@playwright/test';

export class AlbumDetailsPage {
  private readonly page: Page;

  private readonly albumElements: {
    container: Locator;
    editButton: Locator;
  };

  private readonly songElements: {
    section: Locator;
    heading: Locator;
    rows: Locator;
    noSongsMessage: Locator;
  };

  private readonly songFieldSelectors: Record<string, string> = {
    number: '.songs-number',
    title: '.songs-title',
    artists: '.songs-artist',
    duration: '.song-duration',
  };

  constructor(page: Page) {
    this.page = page;

    this.albumElements = {
      container: this.page.locator('.album-container'),
      editButton: this.page.locator('.updateAlbumButton'),
    };

    this.songElements = {
      section: this.page.locator('.songs-section'),
      heading: this.page.locator('.songs-section h2', { hasText: 'Songs' }),
      rows: this.page.locator('.song-table tbody tr'),
      noSongsMessage: this.page.locator('.no-songs-message'),
    };
  }

  async goto(albumId: number): Promise<void> {
    await this.page.goto(`/albums/${albumId}`);
  }

  async isTitleVisible() {
    await expect(this.albumContainer).toBeVisible();
  }

  get albumContainer() {
    return this.page.locator('.album-container');
  }

  get albumTitle() {
    return this.page.locator('.album-title');
  }

  get albumDescription() {
    return this.page.locator('.description');
  }

  get albumGenre() {
    return this.page.locator('.album-genre');
  }

  get albumReleaseDate() {
    return this.page.locator('.album-releaseDate');
  }

  get albumLabel() {
    return this.page.locator('.album-label');
  }

  get albumArtist() {
    return this.page.locator('.album-artist');
  }

  async isEditButtonVisible(): Promise<boolean> {
    return this.albumElements.editButton.isVisible();
  }

  async isEditButtonTextCorrect(): Promise<boolean> {
    return (await this.albumElements.editButton.textContent())?.trim() === 'Edit';
  }

  async clickEdit(): Promise<void> {
    await this.albumElements.editButton.click();
  }

  async getAlbumDetails(): Promise<Record<string, string | null>> {
    const details: Record<string, string | null> = {};

    await this.albumContainer.waitFor({ state: 'visible' });

    details.title = await this.albumTitle.textContent();
    details.description = await this.albumDescription.textContent();
    details.genre = await this.albumGenre.textContent();
    details.releaseDate = await this.albumReleaseDate.textContent();
    details.label = await this.albumLabel.textContent();
    details.artist = await this.albumArtist.textContent();

    return details;
  }

  async getSongsCount(): Promise<number> {
    return await this.songElements.rows.count();
  }

  async getSongAt(index: number): Promise<Record<string, string | null>> {
    const row = this.songElements.rows.nth(index);
    const songDetails: Record<string, string | null> = {};

    for (const [field, selector] of Object.entries(this.songFieldSelectors)) {
      songDetails[field] = await row.locator(selector).textContent();
    }

    return songDetails;
  }

  async isNoSongsMessageVisible(): Promise<boolean> {
    return this.songElements.noSongsMessage.isVisible();
  }

  async isSongsHeadingVisible(): Promise<boolean> {
    return this.songElements.heading.isVisible();
  }
}

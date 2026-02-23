import { Page, Locator, expect } from '@playwright/test';
import { Timeouts } from '../utils/timeouts';

export class PlaylistDetailsPage {
  private readonly page: Page;

  private readonly deleteButton: Locator;
  private readonly toast: Locator;
  private readonly playlistNameHeader: Locator;
  private readonly createPlaylistButton: Locator;
  private readonly createPlaylistHeader: Locator;
  private readonly playlistNameInput: Locator;
  private readonly submitCreateButton: Locator;
  private readonly playlistCards: Locator;
  private readonly playlistsComponent: Locator;

  constructor(page: Page) {
    this.page = page;

    this.deleteButton = this.page.locator('.delete-button');
    this.toast = this.page.locator('.toast-container .toast');
    this.playlistNameHeader = this.page.locator('.playlist-name');

    this.createPlaylistButton = this.page.locator('button:has-text("Create playlist")');
    this.createPlaylistHeader = this.page.locator('h2', { hasText: 'Create New Playlist' });
    this.playlistNameInput = this.page.locator('input[name="name"]');
    this.submitCreateButton = this.page.locator('button[type="submit"]');
    this.playlistCards = this.page.locator('app-playlist-card');
    this.playlistsComponent = this.page.locator('app-playlists');
  }

  async goto(playlistId: number): Promise<void> {
    await this.page.goto(`/playlists/${playlistId}`);
    await expect(this.playlistNameHeader).toBeVisible({ timeout: Timeouts.NAVIGATION_TIMEOUT });
  }

  async gotoMainPlaylistPage(): Promise<void> {
    await this.page.goto(`/playlists`);
    await expect(this.playlistsComponent).toBeVisible({ timeout: Timeouts.NAVIGATION_TIMEOUT });
  }

  async deletePlaylist(): Promise<void> {
    await this.deleteButton.click();
  }

  async waitForSuccessToast(): Promise<void> {
    await this.toast.waitFor({ state: 'visible', timeout: Timeouts.NAVIGATION_TIMEOUT });
  }

  async getSuccessToastMessage(): Promise<string> {
    return await this.toast.innerText();
  }

  async isDeleteButtonVisible(): Promise<boolean> {
    return await this.deleteButton.isVisible();
  }

  async getPlaylistTitle(): Promise<string> {
    return await this.playlistNameHeader.innerText();
  }

  async createPlaylist(name: string): Promise<number> {
    await this.createPlaylistButton.click();
    await expect(this.createPlaylistHeader).toBeVisible({ timeout: Timeouts.NAVIGATION_TIMEOUT });

    await this.playlistNameInput.fill(name);

    await expect(this.submitCreateButton).toBeEnabled({ timeout: Timeouts.NAVIGATION_TIMEOUT });
    await this.submitCreateButton.click();

    await this.waitForSuccessToast();
    await this.page.waitForURL('**/playlists', { timeout: Timeouts.NAVIGATION_TIMEOUT });
    await this.page.waitForTimeout(Timeouts.MEDIUM_TIMEOUT);

    await this.page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        const distance = 10000;
        const delay = 1000;

        const scrollDown = () => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = window.innerHeight;

          if (scrollTop + clientHeight >= scrollHeight) {
            resolve();
            return;
          }
          window.scrollBy(0, distance);
          setTimeout(scrollDown, delay);
        };

        scrollDown();
      });
    });

    const cardCount = await this.playlistCards.count();
    let found = false;

    for (let i = 0; i < cardCount; i++) {
      const card = this.playlistCards.nth(i);
      const titleLocator = card.locator('h3.text-fitting'); 

      try {
        await expect(titleLocator).toBeVisible({ timeout: Timeouts.SHORTER_TIMEOUT });
        const title = await titleLocator.innerText();

        if (title.includes(name)) {
          await card.click(); 
          found = true;
          break;
        }
      } catch (err) {
      }
    }

    

    await this.page.waitForURL(/\/playlists\/\d+/, { timeout: Timeouts.NAVIGATION_TIMEOUT });

    const url = this.page.url();
    const id = Number(url.split('/').pop());

    return id;
  }

  async waitForPlaylistToLoad(name: string): Promise<void> {
    await expect(this.playlistNameHeader).toContainText(name, { timeout: Timeouts.NAVIGATION_TIMEOUT });
  }

  async waitForPlaylistNameHeader(): Promise<void> {
    await this.playlistNameHeader.waitFor({ state: 'visible', timeout: Timeouts.NAVIGATION_TIMEOUT });
  }
}

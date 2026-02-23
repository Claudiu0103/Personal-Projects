import { Page, Locator, expect } from '@playwright/test';

export class PlaylistsPage {
  public async disableCardNavigation(): Promise<void> {
    await this.page.evaluate(() => {
      document.querySelectorAll('app-playlist-card').forEach(card => {
        card.addEventListener('click', e => e.stopImmediatePropagation(), true);
      });
    });
  }

  private readonly page: Page;
  private readonly title: Locator;
  private readonly playlistCards: Locator;
  private readonly emptyMessage: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h2', { hasText: 'Playlists' });
    this.playlistCards = page.locator('app-playlist-card');
    this.emptyMessage = page.locator('text=Kinda quiet in here. Go add some playlists!');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/playlists');
  }

  public async isTitleVisible(): Promise<void> {
    await expect(this.title).toBeVisible();
  }

  public async getPlaylistCount(): Promise<number> {
    await this.page.waitForFunction(() => !!document.querySelector('app-playlist-card'), null);
    await expect(this.playlistCards.first()).toBeVisible();

    return await this.playlistCards.count();
  }

  async getFirstPlaylistCardFollowText(): Promise<string> {
    const cardFollowButtonLocator = this.playlistCards.first().locator('button.follow-btn');
    await cardFollowButtonLocator.waitFor({ state: 'visible' });
    const text = await cardFollowButtonLocator.innerText();
    return text.replace(/favorite(_border)?/gi, '').trim();
  }

  async clickFirstPlaylistCardToggleFollow(): Promise<void> {
    const firstCard = this.playlistCards.first();
    const cardFollowButtonLocator = firstCard.locator('button.follow-btn');

    const initialText = (await cardFollowButtonLocator.innerText()).trim();

    await cardFollowButtonLocator.click();

    await expect(cardFollowButtonLocator).not.toHaveText(initialText, { timeout: 5000 });
  }

  public async getPlaylistCardInfo(index: number): Promise<{ name: string; owner: string }> {
    const card = this.playlistCards.nth(index);
    const name: string = await card.locator('h3').innerText();
    const owner: string = await card.locator('p.owner').innerText();
    return { name, owner };
  }

  public async clickFirstPlaylistCard(): Promise<void> {
    await this.playlistCards.first().click();
  }

  public get titleLocator(): Locator {
    return this.title;
  }

  public get playlistCardsLocator(): Locator {
    return this.playlistCards;
  }

  public get emptyMessageLocator(): Locator {
    return this.emptyMessage;
  }
}
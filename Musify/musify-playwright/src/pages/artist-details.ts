import { Page, Locator, expect } from '@playwright/test';

export class ArtistDetailPage {
  private readonly page: Page;
  private readonly artistName: Locator;
  private readonly artistMeta: Locator;
  private readonly artistPicture: Locator;
  private readonly editButton: Locator;

  // Person details section
  private readonly personDetailsHeader: Locator;
  private readonly personDetailsDropdown: Locator;
  private readonly personInfoContent: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly birthday: Locator;

  // Band details section
  private readonly bandDetailsHeader: Locator;
  private readonly bandDetailsDropdown: Locator;
  private readonly bandInfoContent: Locator;
  private readonly bandLocation: Locator;
  private readonly bandMembers: Locator;

  // Albums section
  private readonly albumsTitle: Locator;
  private readonly albumCards: Locator;
  private readonly scrollContainer: Locator;
  private readonly scrollLeftButton: Locator;
  private readonly scrollRightButton: Locator;

  // Songs section
  private readonly songsTitle: Locator;
  private readonly songTable: Locator;
  private readonly songRows: Locator;

  constructor(page: Page) {
    this.page = page;

    // Artist header elements
    this.artistName = page.locator('.artist-page .artist-name');
    this.artistMeta = page.locator('.artist-page .artist-meta');
    this.artistPicture = page.locator('.artist-page .artist-picture');
    this.editButton = page.locator('.artist-page button:has-text("Edit")');

    // Person details section
    this.personDetailsHeader = page.locator('.dropdown-section h2:has-text("Person Details")');
    this.personDetailsDropdown = page.locator('.dropdown-section:has(h2:has-text("Person Details")) .dropdown-header');
    this.personInfoContent = page.locator('.dropdown-section:has(h2:has-text("Person Details")) .info-content');
    this.firstName = page.locator('.info-content p:has-text("First Name:")');
    this.lastName = page.locator('.info-content p:has-text("Last Name:")');
    this.birthday = page.locator('.info-content p:has-text("Birthday:")');

    // Band details section
    this.bandDetailsHeader = page.locator('.dropdown-section h2:has-text("Band Details")');
    this.bandDetailsDropdown = page.locator('.dropdown-section:has(h2:has-text("Band Details")) .dropdown-header');
    this.bandInfoContent = page.locator('.dropdown-section:has(h2:has-text("Band Details")) .info-content');
    this.bandLocation = page.locator('.info-content p:has-text("Location:")');
    this.bandMembers = page.locator('.info-content .member-card');

    // Albums section
    this.albumsTitle = page.locator('.album-list h2:has-text("Albums")');
    this.albumCards = page.locator('.album-list app-album-card');
    this.scrollContainer = page.locator('app-scroll-container');
    this.scrollLeftButton = page.locator('.scroll-button.left');
    this.scrollRightButton = page.locator('.scroll-button.right');

    // Songs section
    this.songsTitle = page.locator('.songs-section h2:has-text("Songs")');
    this.songTable = page.locator('.songs-section .song-table');
    this.songRows = page.locator('.song-table tbody tr');
  }

  async goto(artistId: string): Promise<void> {
    await this.page.goto(`/artists/${artistId}`);
  }

  async expectArtistNameVisible(): Promise<void> {
    await expect(this.artistName).toBeVisible();
  }

  async getArtistName(): Promise<string> {
    return await this.artistName.innerText();
  }

  async getArtistMeta(): Promise<string> {
    return await this.artistMeta.innerText();
  }

  async expectEditButtonVisible(): Promise<void> {
    await expect(this.editButton).toBeVisible();
  }

  async expectEditButtonNotVisible(): Promise<void> {
    await expect(this.editButton).not.toBeVisible();
  }

  async clickEditButton(): Promise<void> {
    await this.editButton.click();
  }

  // Person details methods
  async expectPersonDetailsVisible(): Promise<void> {
    await expect(this.personDetailsHeader).toBeVisible();
  }

  async togglePersonDetails(): Promise<void> {
    await this.personDetailsDropdown.click();
  }

  async expectPersonInfoExpanded(): Promise<void> {
    await expect(this.personInfoContent).toHaveClass(/show/);
  }

  async expectPersonInfoCollapsed(): Promise<void> {
    await expect(this.personInfoContent).toHaveClass(/hide/);
  }

  async getPersonDetails(): Promise<{ firstName: string; lastName: string; birthday: string }> {
    return {
      firstName: await this.firstName.innerText(),
      lastName: await this.lastName.innerText(),
      birthday: await this.birthday.innerText()
    };
  }

  // Band details methods
  async expectBandDetailsVisible(): Promise<void> {
    await expect(this.bandDetailsHeader).toBeVisible();
  }

  async toggleBandDetails(): Promise<void> {
    await this.bandDetailsDropdown.click();
  }

  async expectBandInfoExpanded(): Promise<void> {
    await expect(this.bandInfoContent).toHaveClass(/show/);
  }

  async expectBandInfoCollapsed(): Promise<void> {
    await expect(this.bandInfoContent).toHaveClass(/hide/);
  }

  async getBandLocation(): Promise<string> {
    return await this.bandLocation.innerText();
  }

  async getBandMemberCount(): Promise<number> {
    return await this.bandMembers.count();
  }

  async getBandMemberInfo(index: number): Promise<{ stageName: string; firstName: string; lastName: string; birthday: string }> {
    const member = this.bandMembers.nth(index);
    return {
      stageName: await member.locator('p:has-text("Stage Name:")').innerText(),
      firstName: await member.locator('p:has-text("First Name:")').innerText(),
      lastName: await member.locator('p:has-text("Last Name:")').innerText(),
      birthday: await member.locator('p:has-text("Birthday:")').innerText()
    };
  }

  // Albums section methods
  async expectAlbumsVisible(): Promise<void> {
    await expect(this.albumsTitle).toBeVisible();
  }

  async getAlbumCount(): Promise<number> {
    return await this.albumCards.count();
  }

  async clickAlbumCard(index: number): Promise<void> {
    await this.albumCards.nth(index).click();
  }

  async getAlbumInfo(index: number): Promise<{ title: string; genre: string; artist: string; releaseDate: string }> {
    const card = this.albumCards.nth(index);
    return {
      title: await card.locator('h3.text-fitting').innerText(),
      genre: await card.locator('.genre').innerText(),
      artist: await card.locator('.artist.text-fitting').innerText(),
      releaseDate: await card.locator('.release-date').innerText()
    };
  }

  async expectScrollButtonsVisible(): Promise<void> {
    await expect(this.scrollLeftButton).toBeVisible();
    await expect(this.scrollRightButton).toBeVisible();
  }

  async scrollAlbumsLeft(): Promise<void> {
    await this.scrollLeftButton.click();
  }

  async scrollAlbumsRight(): Promise<void> {
    await this.scrollRightButton.click();
  }

  // Songs section methods
  async expectSongsVisible(): Promise<void> {
    await expect(this.songsTitle).toBeVisible();
  }

  async getSongCount(): Promise<number> {
    return await this.songRows.count();
  }

  async getSongInfo(index: number): Promise<{ number: string; title: string; artists: string; duration: string }> {
    const row = this.songRows.nth(index);
    const cells = row.locator('td');
    return {
      number: await cells.nth(0).innerText(),
      title: await cells.nth(1).innerText(),
      artists: await cells.nth(2).innerText(),
      duration: await cells.nth(3).innerText()
    };
  }

  async expectSongsNotVisible(): Promise<void> {
    await expect(this.songsTitle).not.toBeVisible();
  }

  async expectAlbumsNotVisible(): Promise<void> {
    await expect(this.albumsTitle).not.toBeVisible();
  }
}
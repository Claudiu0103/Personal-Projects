import { Page, Locator, expect } from '@playwright/test';
import { CreatePlaylistData } from '../utils/interface';

export class CreatePlaylistPage {
  private readonly page: Page;
  private readonly nameInput: Locator;
  private readonly typeSelect: Locator;
  private readonly submitButton: Locator;
  private readonly snackBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.typeSelect = page.locator('mat-select[name="type"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.snackBar = page.locator('div.mat-snack-bar-container');
  }

  async goto(): Promise<void> {
    await this.page.goto('/createPlaylist');
    await this.nameInput.waitFor({ state: 'visible' });

    await this.page.evaluate(() => {
      history.back = () => {};  
    });
  }

  async fillForm(data: CreatePlaylistData): Promise<void> {
    await this.nameInput.fill(data.name);

    await this.typeSelect.click();
    const option = this.page.locator(`mat-option:has-text("${data.type}")`);
    await option.waitFor({ state: 'visible' });
    await option.click();

    await this.page.keyboard.press('Escape');
  }

  async submit(): Promise<void> {
    await expect(this.submitButton).toBeEnabled({ timeout: 5_000 });
    await this.submitButton.click();
  }

 async assertPlaylistCreated(): Promise<void> {
    const successMsg = this.page.getByText('Playlist created successfully!', { exact: true });
    await expect(successMsg).toBeVisible({ timeout: 15_000 });
  }
}

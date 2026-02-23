import { Page, Locator, expect } from '@playwright/test';
import { Timeouts } from '../utils/timeouts';
import { UpdateAlbumData } from '../utils/interface';

export class AlbumUpdatePage {
  private readonly page: Page;

  private readonly fieldMap: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;

    this.fieldMap = {
      form: this.page.locator('form'),
      titleInput: this.page.locator('input[name="title"]'),
      descriptionInput: this.page.locator('textarea[name="description"]'),
      genreInput: this.page.locator('input[name="genre"]'),
      releaseDateInput: this.page.locator('input[name="releaseDate"]'),
      labelInput: this.page.locator('input[name="label"]'),
      saveButton: this.page.locator('button[type="submit"]'),
      toast: this.page.locator('.toast-container .toast'),
    };
  }

  async goto(albumId: number): Promise<void> {
    await this.page.goto(`/albums/${albumId}/edit`);
    await expect(this.fieldMap.form).toBeVisible();
  }

  async fillForm(data: UpdateAlbumData): Promise<void> {
    if (data.title !== undefined) await this.fieldMap.titleInput.fill(data.title);
    if (data.description !== undefined) await this.fieldMap.descriptionInput.fill(data.description);
    if (data.genre !== undefined) await this.fieldMap.genreInput.fill(data.genre);
    if (data.releaseDate !== undefined) await this.fieldMap.releaseDateInput.fill(data.releaseDate);
    if (data.label !== undefined) await this.fieldMap.labelInput.fill(data.label);
  }

  async clearReleaseDateAndTriggerValidation(): Promise<void> {
    await this.fieldMap.releaseDateInput.fill('');
    await this.fieldMap.releaseDateInput.focus();
    await this.fieldMap.titleInput.focus();
  }

  async clearField(name: string) {
    await this.page.locator(`[name="${name}"]`).fill('');
    await this.page.locator(`[name="${name}"]`).blur();
  }

  async submitForm(): Promise<void> {
    await this.fieldMap.saveButton.click();
  }

  async isSaveButtonDisabled(): Promise<boolean> {
    return await this.fieldMap.saveButton.isDisabled();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async isFieldErrorVisible(field: 'title' | 'genre' | 'releaseDate'): Promise<boolean> {
    const messages: Record<string, string> = {
      title: 'Title is required',
      genre: 'Genre is required',
      releaseDate: 'Release Date is required',
    };

    const errorLocator = this.page.getByText(messages[field]);
    return await errorLocator.isVisible();
  }

  async waitForFieldError(field: 'title' | 'genre' | 'releaseDate'): Promise<void> {
    const messages: Record<string, string> = {
      title: 'Title is required',
      genre: 'Genre is required',
      releaseDate: 'Release Date is required',
    };

    const errorLocator = this.page.getByText(messages[field]);
    await errorLocator.waitFor({ state: 'visible', timeout: Timeouts.NAVIGATION_TIMEOUT });
  }

  async waitForErrorToast(): Promise<void> {
    await this.fieldMap.toast.waitFor({ state: 'visible', timeout: Timeouts.NAVIGATION_TIMEOUT });
  }

  async isErrorToastVisible(): Promise<boolean> {
    return await this.fieldMap.toast.isVisible();
  }

  async getErrorToastMessage(): Promise<string> {
    return await this.fieldMap.toast.innerText();
  }

  async waitForSuccessToast(): Promise<void> {
    await this.fieldMap.toast.waitFor({ state: 'visible', timeout: Timeouts.NAVIGATION_TIMEOUT });
  }

  async isSuccessToastVisible(): Promise<boolean> {
    return await this.fieldMap.toast.isVisible();
  }

  async getSuccessToastMessage(): Promise<string> {
    return await this.fieldMap.toast.innerText();
  }

  async setInvalidReleaseDate(value: string): Promise<void> {
    await this.page.evaluate(() => {
      const input = document.querySelector('input[name="releaseDate"]') as HTMLInputElement;
      if (input) input.type = 'text';
    });

    await this.fieldMap.releaseDateInput.fill(value);

    await this.fieldMap.titleInput.click();
  }

  async isReleaseDatePatternErrorVisible(): Promise<boolean> {
    const error = this.page.getByText('Release Date must have a 4-digit year');
    await error.waitFor({ state: 'visible', timeout: Timeouts.NAVIGATION_TIMEOUT });
    return await error.isVisible();
  }
}

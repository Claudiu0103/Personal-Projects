import { Page, Locator, expect } from '@playwright/test';
import { SongOperationData } from '../utils/interface';

export class UpdateSongPage {
  private readonly page: Page;
  private readonly fieldMap: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;

    this.fieldMap = {
      body: this.page.locator('body'),
      title: this.page.locator('input[name="title"]'),
      duration: this.page.locator('input[name="duration"]'),
      artists: this.page.locator('mat-select[name="artists"]'),
      artistsOption: this.page.locator('mat-option'),

      altTitle1: this.page.locator('input[name="altTitle_0"]'),
      altLang1: this.page.locator('input[name="altLang_0"]'),

      altTitle2: this.page.locator('input[name="altTitle_1"]'),
      altLang2: this.page.locator('input[name="altLang_1"]'),

      altTitle3: this.page.locator('input[name="altTitle_2"]'),
      altLang3: this.page.locator('input[name="altLang_2"]'),

      updateButtonSong: this.page.getByRole('button', { name: 'Save' }),

      error: this.page.locator('mat-error').first()
    };
  }

  async goto(songId: number = 1): Promise<void> {
    await this.page.goto(`/songs/${songId}/edit`, { waitUntil: 'domcontentloaded' });
  }

  async isTitleVisible() {
    await expect(this.fieldMap.title).toBeVisible();
  }

  async fillUpdateForm(data: SongOperationData): Promise<void> {

    await this.fieldMap.title.waitFor({ state: 'visible' });
    await this.fieldMap.title.fill(data.title);
    await this.fieldMap.duration.fill(data.duration);

    await this.fieldMap.artists.click();
    const artistOptions = this.page.locator('mat-option');
    const count = await artistOptions.count();
    for (let i = 0; i < count; i++) {
      const option = artistOptions.nth(i);

      if (await option.isVisible() && await option.isEnabled()) {
        await option.click();
        break;
      }
    }

    await this.fieldMap.body.first().click({ position: { x: 0, y: 0 } });

    if (data.alternativeTitles) {
      for (let i = 0; i < data.alternativeTitles.length; i++) {
        const alt = data.alternativeTitles[i];
        const titleLocator = this.page.locator(`input[name="altTitle_${i}"]`);
        const langLocator = this.page.locator(`input[name="altLang_${i}"]`);

        await titleLocator.waitFor({ state: 'visible' });
        await titleLocator.fill(alt.title);

        if (alt.language) {
          await langLocator.fill(alt.language);
        }
      }
    }
  }

  async updateSong(data: SongOperationData): Promise<void> {
    await this.fillUpdateForm(data);
    await this.fieldMap.updateButtonSong.click();

    await this.page.waitForURL(/songs/i);
  }

  async assertFieldError(fieldName: string, expectedError: string): Promise<void> {
    const field = this.fieldMap[fieldName];

    await field.focus();
    await field.clear();
    await field.blur();

    if (fieldName === 'duration') {
      const errorLocator = this.page.locator('mat-error');
      await errorLocator.waitFor({ state: 'visible' });
      await expect(errorLocator).toHaveText('Must be in MM:SS format');
    } else if (fieldName === 'title') {
      const form = this.page.locator('form');
      await expect(form).toHaveClass(/ng-invalid/);
    }
  }

  async fillAltTitleAndLang(index: number, title: string, lang?: string): Promise<void> {
    const actualIndex = index - 1;
    const altTitleField = this.page.locator(`input[name="altTitle_${actualIndex}"]`);
    const altLangField = this.page.locator(`input[name="altLang_${actualIndex}"]`);

    await this.page.waitForSelector(`input[name="altTitle_${actualIndex}"]`, { state: 'attached' });
    await altTitleField.fill(title);


    if (lang) {
      await altLangField.fill(lang);
    }
  }
}
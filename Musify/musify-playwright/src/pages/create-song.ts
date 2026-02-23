import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { SongOperationData } from '../utils/interface';

export class CreateSongPage {
    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            body: this.page.locator('body'),
            title: this.page.locator('input[name="title"]'),
            duration: this.page.locator('input[name="duration"]'),
            alternativeTitles: this.page.locator('input[name^="altTitle_"]'),
            alternativeLanguages: this.page.locator('input[name^="altLang_"]'),
            artists: this.page.locator('mat-select[name="artists"]'),
            submitButton: this.page.locator('button[type=submit]'),
            error: this.page.locator('mat-error')
        };
    }

    async goto(): Promise<void> {
        await this.page.goto('/createSong');
    }

    async isTitleVisible() {
        await expect(this.fieldMap.title).toBeVisible();
    }

    async fillInvalidDuration(): Promise<void> {
        await this.fieldMap.duration.fill('invalidDuration');
    }

    async fillCreateSong(createSongData: SongOperationData): Promise<void> {
        const { title, duration, alternativeTitles } = createSongData;

        await this.fieldMap.title.fill(title);
        await this.fieldMap.duration.fill(duration);

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

        for (let i = 0; i < alternativeTitles.length; i++) {
            const altTitleInput = this.page.locator(`input[name="altTitle_${i}"]`);
            const altLangInput = this.page.locator(`input[name="altLang_${i}"]`);

            await altTitleInput.waitFor({ state: 'visible' });
            await altTitleInput.fill(alternativeTitles[i].title);
            await altLangInput.fill(alternativeTitles[i].language);
        }
    }

    async createSong(createSongData: SongOperationData): Promise<void> {
        await this.fillCreateSong(createSongData);
        await this.fieldMap.submitButton.waitFor({ state: 'visible' });
        await this.fieldMap.submitButton.click();
        await expect(this.page).toHaveURL(/songs/i);
    }

    async assertError(fieldName: string, errorInfo: string): Promise<void> {
        await this.fieldMap[fieldName].click();
        await this.page.click('body');
        await expect(this.fieldMap.error).toHaveText(errorInfo);
        await expect(this.fieldMap.submitButton).toBeDisabled();
    }

}
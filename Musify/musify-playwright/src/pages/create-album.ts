import { Page, Locator, expect } from '@playwright/test';
import { CreateAlbumData } from '../utils/interface.ts';

export class CreateAlbumPage {
    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            title: this.page.locator('input[name="title"]'),
            description: this.page.locator('textarea[name="description"]'),
            genre: this.page.locator('input[name="genre"]'),
            releaseDate: this.page.locator('input[name="releaseDate"]'),
            label: this.page.locator('input[name="label"]'),
            artist: this.page.locator('mat-select[name="artistId"]'),
            songs: this.page.locator('mat-select[name="songs"]'),
            submitButton: this.page.locator('button[type="submit"]'),
            toast: this.page.locator('.toast')
        };
    }

    async goto(): Promise<void> {
        await this.page.goto('/createAlbum');
    }

    async isTitleVisible(): Promise<void> {
        await expect(this.fieldMap.title).toBeVisible();
    }

    async fillForm(data: CreateAlbumData): Promise<void> {
        await this.fieldMap.title.waitFor({ state: 'visible' });
        await this.fieldMap.title.fill(data.title);
        await this.fieldMap.description.fill(data.description);
        await this.fieldMap.genre.fill(data.genre);
        await this.fieldMap.releaseDate.fill(data.releaseDate);
        await this.fieldMap.label.fill(data.label);

        if (data.artistName && data.artistName.trim()) {
            await this.fieldMap.artist.click();

            const artistOption = this.page.locator(`mat-option:has-text("${data.artistName}")`);
            await expect(artistOption).toBeVisible();
            await artistOption.click();
        }

        for (const song of data.songs) {
            if (song.trim()) {
                await this.fieldMap.songs.click();
                const songOption = this.page.locator(`mat-option:has-text("${song}")`);
                await songOption.waitFor({ state: 'visible' });
                await songOption.click();
            }
        }

        await this.page.keyboard.press('Escape');
    }


    async submit(): Promise<void> {
        await this.fieldMap.submitButton.click();
    }

    async assertAlbumCreated(data: CreateAlbumData): Promise<void> {
        await this.fillForm(data);
        await this.submit();
        await expect(this.fieldMap.toast).toContainText('Album created successfully!');
    }

    async assertCannotCreateAlbumWithEmptyFields(data: CreateAlbumData): Promise<void> {
        await this.fillForm(data);
        await expect(this.fieldMap.submitButton).toBeDisabled();
    }

    async assertCannotCreateAlbumWithFutureDate(data: CreateAlbumData): Promise<void> {
        await this.fillForm(data);
        await this.submit();
        await expect(this.fieldMap.toast).toContainText('Release date cannot be in the future!');
    }

}

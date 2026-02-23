import { expect, Locator, Page } from "@playwright/test";
import { CreateArtistData } from "../utils/interface";

export class CreateArtistPage {
    private readonly page: Page;

    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;

        this.fieldMap = {
            typeSelect: this.page.locator('mat-select[name="type"]'),

            startYear: this.page.locator('input[name="startYear"]'),
            startMonth: this.page.locator('input[name="startMonth"]'),
            startDay: this.page.locator('input[name="startDay"]'),
            endYear: this.page.locator('input[name="endYear"]'),
            endMonth: this.page.locator('input[name="endMonth"]'),
            endDay: this.page.locator('input[name="endDay"]'),

            firstName: this.page.locator('input[name="firstName"]'),
            lastName: this.page.locator('input[name="lastName"]'),
            stageName: this.page.locator('input[name="stageName"]'),
            birthDate: this.page.locator('input[name="birthday"]'),

            bandName: this.page.locator('input[name="bandName"]'),
            location: this.page.locator('input[name="location"]'),
            membersSelect: this.page.locator('mat-select[name="members"]'),

            submitButton: this.page.locator('button[type="submit"]'),
            toast: this.page.locator('.toast')
        };
    }

    private getTypeOption(value: string): Locator {
        return this.page.locator(`mat-option:has-text("${value}")`);
    }

    private getMemberOption(name: string): Locator {
        return this.page.locator(`mat-option:has-text("${name}")`);
    }

    async goto(): Promise<void> {
        await this.page.goto('/createArtist');
    }

    async fillForm(data: CreateArtistData): Promise<void> {
        await this.fieldMap.typeSelect.click();
        await this.getTypeOption(data.type).click();

        await this.fieldMap.startYear.fill(data.startDate.year);
        await this.fieldMap.startMonth.fill(data.startDate.month);
        await this.fieldMap.startDay.fill(data.startDate.day);

        if (data.endDate) {
            await this.fieldMap.endYear.fill(data.endDate.year);
            await this.fieldMap.endMonth.fill(data.endDate.month);
            await this.fieldMap.endDay.fill(data.endDate.day);
        }

        if (data.type === 'Person') {
            await this.fieldMap.firstName.fill(data.personDetails.firstName);
            await this.fieldMap.lastName.fill(data.personDetails.lastName);
            await this.fieldMap.stageName.fill(data.personDetails.stageName);
            await this.fieldMap.birthDate.fill(data.personDetails.birthDate);
        }

        if (data.type === 'Band') {
            await this.fieldMap.bandName.fill(data.bandDetails.bandName);
            await this.fieldMap.location.fill(data.bandDetails.location);
            
            await this.fieldMap.membersSelect.click();
            
            const firstMemberOption = this.page.locator('mat-select[name="members"]').first();
            await firstMemberOption.waitFor({ state: 'visible' });
            await firstMemberOption.click();

            await this.page.keyboard.press('Escape');
        }
    }

    async submit(): Promise<void> {
        await this.fieldMap.submitButton.click();
    }

    async assertArtistCreated(): Promise<void> {
        await expect(this.fieldMap.toast).toContainText('Artist created successfully!');
    }

    async assertCannotCreateWithEmptyFields(data: CreateArtistData): Promise<void> {
        await this.fillForm(data);
        await expect(this.fieldMap.submitButton).toBeDisabled();
    }

    async assertCannotCreateBandWithWhitespaces(data: CreateArtistData): Promise<void> {
        await this.fillForm(data);
        await expect(this.fieldMap.submitButton).toBeDisabled();
    }

    async isTypeVisible(): Promise<void> {
        await expect(this.fieldMap.typeSelect).toBeVisible();
    }
}
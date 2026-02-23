import { Page, Locator, expect } from '@playwright/test';
import { UpdateArtistData } from '../utils/interface';

export class UpdateArtistPage
 {
  private readonly page: Page;
  private readonly fieldMap: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;

    this.fieldMap = 
    {
      firstName: this.page.locator('input[name="firstName"]'),
      lastName: this.page.locator('input[name="lastName"]'),
      stageName: this.page.locator('input[name="stageName"]'),
      birthday: this.page.locator('input[name="birthday"]'),

      bandName: this.page.locator('input[name="bandName"]'),
      location: this.page.locator('input[name="location"]'),
      members: this.page.locator('mat-select[name="members"]'),

      endYear: this.page.locator('input[name="endYear"]'),
      endMonth: this.page.locator('input[name="endMonth"]'),
      endDay: this.page.locator('input[name="endDay"]'),

      personSection: this.page.locator('.person-section'),
      bandSection: this.page.locator('.band-section'),

      UpdateArtistButton: page.getByRole('button', { name: 'Save' }),
    };
  }
  
  async goto(artistId: number): Promise<void> 
  {
    await this.page.goto(`/artist/${artistId}/edit`, { waitUntil: 'domcontentloaded' });
  }

  async validateFormSectionVisibility() 
  {
        if (await this.fieldMap.personSection.isVisible()) 
        {
            await expect(this.page.getByLabel('First Name')).toBeVisible();
        } 
        else if (await this.fieldMap.bandSection.isVisible())
        {
            await expect(this.page.getByLabel('Band Name')).toBeVisible();
        }
  }

  async fillUpdateForm(data: UpdateArtistData): Promise<void> 
  {

     if (data.type === 'Person') 
    {
      await this.fieldMap.firstName.fill(data.personDetails.firstName);
      await this.fieldMap.lastName.fill(data.personDetails.lastName);
      await this.fieldMap.stageName.fill(data.personDetails.stageName);
      await this.fieldMap.birthday.fill(data.personDetails.birthDate);
    }

    if (data.type === 'Band') 
    {
     await this.fieldMap.bandName.fill(data.bandDetails.bandName);
     await this.fieldMap.location.fill(data.bandDetails.location);
    }
    if (data.endDate) 
    {
      await this.fieldMap.endYear.fill(data.endDate.year);
      await this.fieldMap.endMonth.fill(data.endDate.month);
      await this.fieldMap.endDay.fill(data.endDate.day);
    }
  }

  async updateArtist(data: UpdateArtistData): Promise<void>
  {
      await this.fillUpdateForm(data);
      await this.fieldMap.UpdateArtistButton.click();
      await this.page.waitForURL(/artists/i);
  }

  async assertFieldError(fieldName: string, expectedError: string): Promise<void> 
  {
    const field = this.fieldMap[fieldName];
    await field.fill('');
    await field.blur();

    const errorLocator = this.page.locator('mat-error');
    await errorLocator.waitFor({ state: 'visible' });
    await expect(errorLocator).toContainText(expectedError);
  }

}
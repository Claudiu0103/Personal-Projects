import { Page, Locator, expect } from '@playwright/test';

export class UserListPage {
  private readonly page: Page;

  private readonly fieldMap: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;

    this.fieldMap = {
      pageTitle: this.page.locator('h2'),
      tableRows: this.page.locator('mat-row'),
      pageInfo: this.page.locator('.page-controls span'),
      nextPage: this.page.locator('.page-controls button:has-text("›")'),
      prevPage: this.page.locator('.page-controls button:has-text("‹")'),
    };
  }

  async goto(): Promise<void> {
    await this.page.goto('/userDashboard');
    await expect(this.fieldMap.pageTitle).toHaveText('List of users');
  }

  async getAllRowTexts(): Promise<string[]> {
    return await this.fieldMap.tableRows.allTextContents();
  }

  async getFirstRowText(): Promise<string> {
    return (await this.fieldMap.tableRows.first().textContent())?.trim() || '';
  }

  async clickNextPage(): Promise<void> {
    await this.fieldMap.nextPage.click();
  }

  async clickPrevPage(): Promise<void> {
    await this.fieldMap.prevPage.click();
  }

  async getTotalUserCount(): Promise<number> {
    const text = await this.fieldMap.pageInfo.textContent();
    const match = text?.match(/of\s+(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  async expectNoDuplicateUsers(): Promise<void> {
    const rows = await this.getAllRowTexts();
    const unique = new Set(rows);
    expect(rows.length).toBe(unique.size);
  }
}

import { Page, Locator, expect } from '@playwright/test';
import { Timeouts } from '../utils/timeouts';
import { MockData } from '../utils/mock-data';

export class UserDialogPage {
  readonly page: Page;
  readonly userRow: Locator;
  readonly title: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly role: Locator;
  readonly banned: Locator;
  readonly deleteButton: Locator;
  readonly changeRoleButton: Locator;
  readonly confirmDialog: Locator;
  readonly confirmDialogTitle: Locator;
  readonly confirmDialogBody: Locator;
  readonly cancelBanButton: Locator;
  readonly confirmBanButton: Locator;
  readonly toast: Locator;
  readonly dialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userRow = page.locator('mat-table mat-row').first();
    this.title = page.locator('.profile-title');
    this.name = page.locator('.profile-info p:nth-child(1)');
    this.email = page.locator('.profile-info p:nth-child(2)');
    this.role = page.locator('.profile-info p:nth-child(3)');
    this.banned = page.locator('.profile-info p:nth-child(4)');
    this.deleteButton = page.locator('button[mat-raised-button][color="warn"]');
    this.changeRoleButton = page.locator('button[mat-raised-button][color="accent"]');
    this.confirmDialog = page.locator('.custom-dialog');
    this.confirmDialogTitle = page.locator('.custom-dialog-header h2');
    this.confirmDialogBody = page.locator('.custom-dialog-body');
    this.cancelBanButton = page.locator('.cancel-btn');
    this.confirmBanButton = page.locator('.confirm-btn');
    this.toast = page.locator('.toast');
    this.dialog = page.locator('mat-dialog-content');
  }

  async goto(): Promise<void> {
    await this.page.goto('/userDashboard', { waitUntil: 'networkidle' });
    await this.page.evaluate(() => localStorage.clear());
    await this.page.waitForSelector('mat-table mat-row', { state: 'visible', timeout: Timeouts.MEDIUM_TIMEOUT });
  }

  async openUserDialog(): Promise<void> {
    await this.page.locator('mat-table').waitFor({ state: 'visible', timeout: Timeouts.MEDIUM_TIMEOUT });
    const rows = await this.page.locator('mat-table mat-row').all();
    console.log('Number of rows:', rows.length);
    await this.userRow.waitFor({ state: 'visible', timeout: Timeouts.MEDIUM_TIMEOUT });
    await expect(this.userRow).toBeEnabled({ timeout: Timeouts.MEDIUM_TIMEOUT });
    console.log('Clicking user row:', await this.userRow.textContent());
    await this.userRow.click();
    await this.dialog.waitFor({ state: 'visible', timeout: Timeouts.MEDIUM_TIMEOUT });
  }

  async verifyDialogContent(): Promise<void> {
    await expect(this.title).toContainText('User Actions');
    await expect(this.name).toContainText('Name:');
    await expect(this.email).toContainText('Email:');
    const roleText = await this.role.textContent();
    console.log('User role in dialog:', roleText);
    await expect(this.role).toContainText('Role:');
    await expect(this.banned).toContainText('Banned:');
    await expect(this.deleteButton).toBeVisible();
    if (!roleText || !roleText.includes('ADMIN')) {
      await expect(this.changeRoleButton).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    }
    if (roleText && roleText.includes('ADMIN')) {
      console.log('Skipping changeRoleButton check for ADMIN user');
    }
  }

  async banUser(): Promise<void> {
    await this.deleteButton.click();
    await this.confirmDialog.waitFor({ state: 'visible', timeout: Timeouts.SHORT_TIMEOUT });
    await this.confirmBanButton.click();
    await this.page.waitForTimeout(1000);
    await expect(this.toast).toHaveText('User banned', { timeout: Timeouts.MEDIUM_TIMEOUT });
    await expect(this.dialog).not.toBeVisible();
  }

  async cancelBan(): Promise<void> {
    await this.deleteButton.click();
    await this.confirmDialog.waitFor({ state: 'visible', timeout: Timeouts.SHORT_TIMEOUT });
    await this.cancelBanButton.click();
    await expect(this.confirmDialog).not.toBeVisible();
    await expect(this.dialog).toBeVisible();
  }

  async changeRole(): Promise<void> {
    await expect(this.changeRoleButton).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    await this.changeRoleButton.click();
    await this.page.waitForTimeout(1000);
    await expect(this.toast).toHaveText('Role changed', { timeout: Timeouts.MEDIUM_TIMEOUT });
    await expect(this.dialog).not.toBeVisible();
  }

  async failBanUser(): Promise<void> {
    await this.deleteButton.click();
    await this.confirmDialog.waitFor({ state: 'visible', timeout: Timeouts.SHORT_TIMEOUT });
    await this.confirmBanButton.click();
    await this.page.waitForTimeout(1000);
    await expect(this.toast).toHaveText('Failed to delete user', { timeout: Timeouts.MEDIUM_TIMEOUT });
    await expect(this.dialog).toBeVisible();
  }

  async failChangeRole(): Promise<void> {
    await expect(this.changeRoleButton).toBeVisible({ timeout: Timeouts.MEDIUM_TIMEOUT });
    await this.changeRoleButton.click();
    await this.page.waitForTimeout(1000);
    await expect(this.toast).toHaveText('Failed to change the role', { timeout: Timeouts.MEDIUM_TIMEOUT });
    await expect(this.dialog).toBeVisible();
  }

  async mockSuccessDelete(): Promise<void> {
    await this.page.route('**/api/admins/users/15', (route) => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({
          status: 200,
          body: JSON.stringify(MockData.mockRegularUser)
        });
      }
    });
  }

  async mockSuccessRoleChange(): Promise<void> {
    await this.page.route('**/api/admins/users/15', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          body: JSON.stringify(MockData.mockAdminUser)
        });
      }
    });
  }

  async mockFailDelete(): Promise<void> {
    await this.page.route('**/api/admins/users/15', (route) => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Failed to ban user' }) });
      }
    });
  }

  async mockFailRoleChange(): Promise<void> {
    await this.page.route('**/api/admins/users/15', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Failed to change role' }) });
      }
    });
  }

  async mockUserData(): Promise<void> {
    await this.page.route('**/api/users*', (route) => {
      console.log('Mocking /api/users with REGULAR user and query params');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            MockData.mockRegularUser
          ],
          pageable: {
            pageNumber: 0,
            pageSize: 10,
            sort: { sorted: true, unsorted: false, empty: false }
          },
          totalPages: 1,
          totalElements: 1,
          last: true,
          numberOfElements: 1,
          size: 10,
          number: 0,
          empty: false
        })
      });
    });
  }
}
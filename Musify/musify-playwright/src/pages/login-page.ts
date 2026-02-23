import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { LoginData } from '../utils/interface';
export class LoginPage {

  private readonly page: Page;
  private readonly fieldMap: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.fieldMap = {
      email: page.locator('input[name="email"]'),
      password: page.locator('input[name="password"]'),
      submitButton: page.locator('button[type=submit]'),
      error: page.locator('.error')
    };
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }


  async loginFill(loginData: LoginData): Promise<void> {
    await this.fieldMap.email.fill(loginData.email);
    await this.fieldMap.password.fill(loginData.password);
  }
  async login(loginData: LoginData): Promise<void> {
    this.loginFill(loginData);
    await this.fieldMap.submitButton.waitFor({ state: 'visible' })
    await this.fieldMap.submitButton.click();
  }

  async assertErrorField(fieldName: string, errorInfo: string): Promise<void> {
    await this.fieldMap[fieldName].click();
    await this.page.click('body');
    await expect(this.fieldMap.error).toHaveText(errorInfo);
  }
}
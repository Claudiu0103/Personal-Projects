import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { generateRandomInvalidEmail } from '../utils/random';
import { RegisterData } from '../utils/interface';

export class RegisterPage {
    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            firstNameInput:  this.page.locator('input[name="firstName"]'),
            lastNameInput:  this.page.locator('input[name="lastName"]'),
            emailInput:  this.page.locator('input[name="email"]'),
            countryInput:  this.page.locator('input[name="country"]'),
            passwordInput:  this.page.locator('input[name="password"]'),
            confirmPasswordInput:  this.page.locator('input[name="confirmPassword"]'),
            submitButton:  this.page.locator('button[type=submit]'),
            errorInput:  this.page.locator('.error')
        };
    }

    async goto():Promise<void> {
        await this.page.goto('/register');
    }

    async fillInvalidEmail():Promise<void>{
        const email=generateRandomInvalidEmail();
        await this.fieldMap.emailInput.fill(email);
    }

    public async fillRegister(registerData:RegisterData):Promise<void> {
        await this.fieldMap.firstNameInput.fill(registerData.firstName);
        await this.fieldMap.lastNameInput.fill(registerData.lastName);
        await this.fieldMap.emailInput.fill(registerData.email);
        await this.fieldMap.countryInput.fill(registerData.country);
        await this.fieldMap.passwordInput.fill(registerData.password);
        await this.fieldMap.confirmPasswordInput.fill(registerData.confirmPassword);
    }

    async register(registerData:RegisterData):Promise<void> {
        this.fillRegister(registerData);
        await this.fieldMap.submitButton.waitFor({ state: 'visible' });
        await this.fieldMap.submitButton.click();
        await expect(this.page).toHaveURL(/home/i);
    }

    async assertErrorField(fieldName: string, errorInfo:string):Promise<void>{
        await this.fieldMap[`${fieldName}Input`].click();
        await this.page.click('body');
        await expect(this.fieldMap.errorInput).toHaveText(errorInfo);
    }
}

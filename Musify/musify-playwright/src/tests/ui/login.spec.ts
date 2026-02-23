import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('Login Page Tests', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
        await page.waitForSelector('input[name="email"]')
    });

    test('Verify if user can successfully log in with valid credentials', async ({ page }) => {
        await loginPage.login({ email: 'admin@musify.com', password: 'Admin123!' });
        await expect(page).toHaveURL(/.*home/);
    });

    test('Verify if user can\'t log in with invalid credentials', async ({ page }) => {
        await loginPage.login({ email: 'admin@musify.com', password: 'Admin1' });

        await expect(page).not.toHaveURL(/.*home/);

        await expect(page.locator('.errorFromBackend')).toBeVisible();

        await expect(page.locator('.errorFromBackend')).toHaveText('Credentials are incorrect');

    });

    test('Verify if user can\'t log in with email field left empty', async ({ page }) => {
        await loginPage.assertErrorField('email', 'Please enter a valid email')
    });

    test('Verify if user can\'t log in with password field left empty', async ({ page }) => {
        await loginPage.assertErrorField('password', 'Please enter a valid password')
    });
});
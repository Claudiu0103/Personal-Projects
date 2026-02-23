import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/register-page';
import { generateUniqueEmail } from '../../utils/random';

test.describe('Register Tests', () => {
  let registerPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('Verify if user can register successfully', async () => {
    await registerPage.register({
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      email: generateUniqueEmail(),
      country: 'RO',
      password: 'Test1234.',
      confirmPassword: 'Test1234.'
    });
  });

  test('Verify if register form shows error when first name is empty', async () => {
    await registerPage.assertErrorField('firstName', 'First name is required.');
  });

  test('Verify if register form shows error when last name is empty when register', async () => {
    await registerPage.assertErrorField('lastName', 'Last name is required.');
  });

  test('Verify if register form shows error when email is empty when register', async () => {
    await registerPage.assertErrorField('email', 'Please enter a valid email.');
  });

  test('Verify if register form shows error when invalid email when register', async () => {
    await registerPage.fillInvalidEmail();
    await registerPage.assertErrorField('email', 'Please enter a valid email.');
  });

  test('Verify if register form shows error when country is empty when register', async () => {
    await registerPage.assertErrorField('country', 'Country is required.');
  });

  test('Verify if register form shows error when password is empty when register', async () => {
    await registerPage.assertErrorField('password', 'Password is required.');
  });

  test('Verify if register form shows error when confirm password is empty when register', async () => {
    await registerPage.assertErrorField('confirmPassword', 'Confirm Password is required.');
  });
});
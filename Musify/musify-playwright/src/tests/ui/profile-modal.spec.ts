import { test } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { ProfileModal } from '../../pages/profile-modal';
import { generateRandomPassword } from '../../utils/random';


test.describe('Profile Modal - Regular User', () => {
  test.use({ storageState: 'src/config/regularLoggedInState.json' });

  test('Verify if user can succesfully update their details with valid input', async ({ page }) => {
    const homePage: HomePage = new HomePage(page);
    await homePage.goto();
    await homePage.openProfileModal();

    const profileModal = new ProfileModal(page);
    await profileModal.updateProfile();

    await profileModal.assertUpdateProfile();

    await profileModal.revertUpdateProfile();
  });

  test('Verify if user can\'t change password if the old and new passwords are the same', async ({ page }) => {
    const homePage: HomePage = new HomePage(page);
    await homePage.goto();
    await homePage.openProfileModal();
    const profileModal = new ProfileModal(page);
    const currentPassword = process.env.REGULAR_USER_PASSWORD || "none";
    await profileModal.changePassword({
      currentPassword: currentPassword,
      newPassword: currentPassword,
      confirmPassword: currentPassword
    });
    await profileModal.assertInfoMessage('⚠ Passwords are the same!');
  })

  test('Verify if user can\'t change passwords with empty input fields', async ({ page }) => {
    const homePage: HomePage = new HomePage(page);
    await homePage.goto();
    await homePage.openProfileModal();

    const profileModal = new ProfileModal(page);
    await profileModal.changePassword({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    await profileModal.assertInfoMessage('⚠ Password fields cannot be empty');
  })

  test('Verify that user can successfully change password with valid inputs', async ({ page }) => {
    const homePage: HomePage = new HomePage(page);
    await homePage.goto();
    await homePage.openProfileModal();

    const testPassowrd = generateRandomPassword(10);
    const currentPassword = process.env.REGULAR_USER_PASSWORD || "none";
    const profileModal = new ProfileModal(page);
    await profileModal.changePassword({
      currentPassword: currentPassword,
      newPassword: testPassowrd,
      confirmPassword: testPassowrd
    });
    await profileModal.assertInfoMessage('☑ Password changed successfully');
    await profileModal.cancelAction();
    await profileModal.changePassword({
      currentPassword: testPassowrd,
      newPassword: currentPassword,
      confirmPassword: currentPassword
    });
    await profileModal.assertInfoMessage('☑ Password changed successfully');
  })
});
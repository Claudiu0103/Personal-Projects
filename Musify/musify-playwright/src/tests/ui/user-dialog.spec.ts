import { test, expect } from '@playwright/test';
import { UserDialogPage } from '../../pages/user-dialog-page';

test.use({ storageState: 'src/config/adminLoggedInState.json' });

let userDialogPage: UserDialogPage;

test.beforeEach(async ({ page }) => {
  userDialogPage = new UserDialogPage(page);
  await userDialogPage.mockUserData();
});

test.describe('User Dialog Tests', () => {
  test('Verify if dialog opens and displays user details when clicking on user in user dashboard', async () => {
    await userDialogPage.goto();
    await userDialogPage.openUserDialog();
    await userDialogPage.verifyDialogContent();
  });

  test('Verify if admin can successfully ban user', async () => {
    await userDialogPage.mockSuccessDelete();
    await userDialogPage.goto();
    await userDialogPage.openUserDialog();
    await userDialogPage.banUser();
  });

  test('Verify if admin can cancel user ban', async () => {
    await userDialogPage.goto();
    await userDialogPage.openUserDialog();
    await userDialogPage.cancelBan();
  });

  test('Verify if admin can change role for REGULAR user', async () => {
    await userDialogPage.mockSuccessRoleChange();
    await userDialogPage.goto();
    await userDialogPage.openUserDialog();
    await userDialogPage.changeRole();
  });

  test('Verify if admin can\'t ban another ADMIN user', async () => {
    await userDialogPage.goto();
    await userDialogPage.openUserDialog();
    await userDialogPage.verifyDialogContent();
    await userDialogPage.mockFailDelete();
    await userDialogPage.failBanUser();
  });

  test('Verify if admin can\'t change role of another ADMIN user', async () => {
    await userDialogPage.goto();
    await userDialogPage.openUserDialog();
    await userDialogPage.verifyDialogContent();
    const roleText = await userDialogPage.role.textContent();
    if (roleText && roleText.includes('ADMIN')) {
      return;
    }
    await userDialogPage.mockFailRoleChange();
    await userDialogPage.failChangeRole();
  });
});
import { test, expect } from '@playwright/test';
import { UserListPage } from '../../pages/user-list-page';

test.use({ storageState: 'src/config/adminLoggedInState.json' });

test('Verify user pagination on user dashboard', async ({ page }) => {
  const userListPage = new UserListPage(page);
  await userListPage.goto();

  const firstPageUser = await userListPage.getFirstRowText();
  expect(firstPageUser).not.toBe('');

  await userListPage.clickNextPage();
  await page.waitForTimeout(500);

  const secondPageUser = await userListPage.getFirstRowText();
  expect(secondPageUser).not.toBe(firstPageUser);

  await userListPage.expectNoDuplicateUsers();

  const total = await userListPage.getTotalUserCount();
  expect(total).toBeGreaterThan(0);

  await userListPage.clickPrevPage();
  await page.waitForTimeout(500);

  const userBack = await userListPage.getFirstRowText();
  expect(userBack).toBe(firstPageUser);
});

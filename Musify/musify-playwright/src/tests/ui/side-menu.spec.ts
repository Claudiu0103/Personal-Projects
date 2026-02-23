import { test } from '@playwright/test';
import { SideMenuPage } from '../../pages/side-menu';

test.describe('Side Menu Tests for Regular User', () => {
    let sideMenu: SideMenuPage;

    test.use({ storageState: './src/config/regularLoggedInState.json' });

    test.beforeEach(async ({ page }) => {
        sideMenu = new SideMenuPage(page);
        await sideMenu.goto();
        await sideMenu.homeButtonVisible();
    });

    const visibleMenuItems = ['home', 'songs', 'artists', 'albums', 'playlists'] as const;
    const hiddenAdminMenuItems = ['createSong', 'createArtist', 'createAlbum', 'userDashboard'] as const;

    for (const item of visibleMenuItems) {
        test(`Verify that menu item "${item}" is displayed and navigates user to the correct page`, async () => {
            await sideMenu.expectMenuItemVisible(item);
            await sideMenu.navigateTo(item);
        });
    }

    for (const item of hiddenAdminMenuItems) {
        test(`Verify that admin-only menu item "${item}" is hidden`, async () => {
            await sideMenu.expectMenuItemHidden(item);
        });
    }
});

test.describe('Side Menu Tests for Admin User', () => {
    let sideMenu: SideMenuPage;

    test.use({ storageState: './src/config/adminLoggedInState.json' });

    test.beforeEach(async ({ page }) => {
        sideMenu = new SideMenuPage(page);
        await sideMenu.goto();
        await sideMenu.homeButtonVisible();
    });

    const adminMenuItems = ['home', 'songs', 'artists', 'albums', 'playlists', 'createSong', 'createArtist', 'createAlbum', 'userDashboard'] as const;

    for (const item of adminMenuItems) {
        test(`Verify that menu item "${item}" is displayed and navigates user to the correct page`, async () => {
            await sideMenu.expectMenuItemVisible(item);
            await sideMenu.navigateTo(item);
        });
    }
});
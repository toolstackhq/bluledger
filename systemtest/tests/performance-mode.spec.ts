import { expect, test } from '../fixtures/test-fixtures';

test.describe('BluLedger performance mode', () => {
  test('session-only slow mode shows a loading overlay during route changes @regression', async ({
    appConfig,
    dashboardPage,
    loginPage,
    page
  }) => {
    await loginPage.goto();
    await expect(page).toHaveURL(/\/login$/);

    await loginPage.openPerformanceSettings();
    await expect(await loginPage.getPerformanceModeValue()).toBe('fast');

    await loginPage.selectPerformanceMode('slow');
    await loginPage.setPerformanceDelayRange('1200', '1200');
    await loginPage.savePerformanceSettings();

    await loginPage.login(
      appConfig.credentials.username,
      appConfig.credentials.password
    );

    await loginPage.waitForLoadingOverlay();
    await loginPage.waitForLoadingOverlayToDisappear();
    await dashboardPage.waitForReady();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('a fresh browser session resets the performance mode back to fast @regression', async ({
    loginPage,
    page
  }) => {
    await loginPage.goto();
    await expect(page).toHaveURL(/\/login$/);

    await loginPage.openPerformanceSettings();
    await expect(await loginPage.getPerformanceModeValue()).toBe('fast');
    await expect(await loginPage.getPerformanceMinDelayValue()).toBe('2000');
    await expect(await loginPage.getPerformanceMaxDelayValue()).toBe('10000');
  });
});

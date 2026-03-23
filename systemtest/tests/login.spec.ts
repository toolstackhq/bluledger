import { expect, test } from '../fixtures/test-fixtures';

test.describe('BluLedger login', () => {
  test('customer can sign in with seeded credentials @smoke @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    stepLogger,
    page
  }) => {
    await stepLogger.run('Open the login page', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });

    await stepLogger.run('Sign in with the seeded demo customer', async () => {
      await loginPage.login(
        appConfig.credentials.username,
        appConfig.credentials.password
      );
    });

    await stepLogger.run('Verify the authenticated dashboard shell', async () => {
      await dashboardPage.waitForReady();
      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(
        page.getByRole('heading', { level: 1, name: 'Account Summary' })
      ).toBeVisible();
      await expect(page.getByTestId('logout-button')).toBeVisible();
      await expect(page.getByTestId('dashboard-account-summary')).toBeVisible();
      await expect(await dashboardPage.getSignedInCustomerName()).toContain(
        'Alicia Warren'
      );
    });
  });
});

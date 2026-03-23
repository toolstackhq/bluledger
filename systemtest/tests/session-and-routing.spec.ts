import { expect, test } from '../fixtures/test-fixtures';

test.describe('BluLedger session and routing behavior', () => {
  test('remember customer ID persists after logout when selected @critical', async ({
    loginPage,
    dashboardPage,
    appShellPage,
    page
  }) => {
    await loginPage.goto();
    await loginPage.setRememberCustomerId(true);
    await loginPage.login('92718463', 'Harbour!92');
    await dashboardPage.waitForReady();

    await appShellPage.logout();
    await expect(page).toHaveURL(/\/login$/);
    await expect(await loginPage.getCustomerIdValue()).toBe('92718463');
  });

  test('customer ID is cleared on logout when remember me is not selected @critical', async ({
    loginPage,
    dashboardPage,
    appShellPage,
    page
  }) => {
    await loginPage.goto();
    await loginPage.setRememberCustomerId(false);
    await loginPage.login('92718463', 'Harbour!92');
    await dashboardPage.waitForReady();

    await appShellPage.logout();
    await expect(page).toHaveURL(/\/login$/);
    await expect(await loginPage.getCustomerIdValue()).toBe('');
  });

  test('test user modal prefills an alternate persona and signs in successfully @critical', async ({
    loginPage,
    dashboardPage
  }) => {
    await loginPage.goto();
    await loginPage.openTestUsersModal();
    await loginPage.chooseTestUser(2);
    await expect(await loginPage.getCustomerIdValue()).toBe('38451209');
    await expect(await loginPage.getPasswordValue()).toBe('Jacaranda#47');

    await loginPage.submit();
    await dashboardPage.waitForReady();
    await expect(await dashboardPage.getSignedInCustomerName()).toContain('Marcus Cole');
  });

  test('unknown routes handle unauthenticated and authenticated users correctly @critical', async ({
    loginPage,
    notFoundPage,
    dashboardPage,
    page
  }) => {
    await notFoundPage.goto('/does-not-exist');
    await notFoundPage.waitForReady();
    await notFoundPage.returnToSignIn();
    await expect(page).toHaveURL(/\/login$/);

    await loginPage.login('92718463', 'Harbour!92');
    await dashboardPage.waitForReady();

    await notFoundPage.goto('/missing-after-login');
    await notFoundPage.waitForReady();
    await notFoundPage.backToDashboard();
    await dashboardPage.waitForReady();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('dashboard transfer entry points route to the transfer page @critical', async ({
    loginPage,
    dashboardPage,
    transferPage,
    page
  }) => {
    await loginPage.goto();
    await loginPage.login('92718463', 'Harbour!92');
    await dashboardPage.waitForReady();

    await dashboardPage.openQuickTransfer();
    await transferPage.waitForReady();
    await expect(page).toHaveURL(/\/transfers$/);

    await dashboardPage.goto();
    await dashboardPage.waitForReady();
    await dashboardPage.openAccountTransfer('acct-everyday');
    await transferPage.waitForReady();
    await expect(page).toHaveURL(/\/transfers$/);
  });
});

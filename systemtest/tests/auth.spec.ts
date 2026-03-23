import { expect, test } from '../fixtures/test-fixtures';

test.describe('BluLedger authentication guardrails', () => {
  test('protected routes redirect to login and invalid credentials are rejected @critical', async ({
    dashboardPage,
    loginPage,
    page
  }) => {
    await dashboardPage.goto();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-submit')).toBeVisible();

    await loginPage.login('92718463', 'WrongPassword!1');
    await expect(await loginPage.getFormError()).toContain(
      'Customer ID or password is incorrect.'
    );
    await expect(page).toHaveURL(/\/login$/);
  });
});

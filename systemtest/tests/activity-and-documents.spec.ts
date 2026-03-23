import { expect, test } from '../fixtures/test-fixtures';

async function loginAsPrimaryUser({
  appConfig,
  loginPage,
  dashboardPage
}: {
  appConfig: { credentials: { username: string; password: string } };
  loginPage: { goto: () => Promise<void>; login: (username: string, password: string) => Promise<void> };
  dashboardPage: { waitForReady: () => Promise<void> };
}): Promise<void> {
  await loginPage.goto();
  await loginPage.login(appConfig.credentials.username, appConfig.credentials.password);
  await dashboardPage.waitForReady();
}

test.describe('BluLedger activity and statements', () => {
  test('transactions can be expanded and filtered by search, account, type, and status @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    transactionsPage
  }) => {
    await loginAsPrimaryUser({ appConfig, loginPage, dashboardPage });

    await transactionsPage.goto();
    await transactionsPage.waitForReady();
    await expect(await transactionsPage.getVisibleRowCount()).toBe(12);

    await transactionsPage.search('Coffee');
    await expect(await transactionsPage.getTableText()).toContain('Market Lane Coffee');
    await expect(await transactionsPage.getVisibleRowCount()).toBe(1);

    await transactionsPage.search('');
    await transactionsPage.filterAccount('acct-offset');
    await transactionsPage.filterType('Scheduled payment');
    await transactionsPage.filterStatus('Pending');
    await expect(await transactionsPage.getTableText()).toContain(
      'Scheduled Mortgage Sweep'
    );
    await expect(await transactionsPage.getVisibleRowCount()).toBe(1);

    await transactionsPage.search('NO MATCH TERM');
    await expect(await transactionsPage.getEmptyStateText()).toContain(
      'No transactions matched your search'
    );
  });

  test('statements can be switched and exported as CSV and PDF @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    statementsPage,
    appShellPage
  }) => {
    await loginAsPrimaryUser({ appConfig, loginPage, dashboardPage });

    await statementsPage.goto();
    await statementsPage.waitForReady();
    await statementsPage.selectAccount('acct-saver');
    await expect(await statementsPage.getPageText()).toContain('Online Saver Statement');
    await expect(await statementsPage.getPageText()).toContain('Online Saver');

    const csvDownload = await statementsPage.downloadCsv();
    await expect(await csvDownload.suggestedFilename()).toBe('saver-2025-03-19.csv');
    await expect(await appShellPage.getToastText()).toContain('CSV statement generated.');

    const pdfDownload = await statementsPage.downloadPdf();
    await expect(await pdfDownload.suggestedFilename()).toBe('saver-2025-03-19.pdf');
    await expect(await appShellPage.getToastText()).toContain('PDF statement generated.');
  });
});

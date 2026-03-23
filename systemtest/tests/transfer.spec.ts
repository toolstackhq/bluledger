import { expect, test } from '../fixtures/test-fixtures';

function futureDate(daysFromToday: number): string {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysFromToday);
  return nextDate.toISOString().slice(0, 10);
}

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

test.describe('BluLedger transfers', () => {
  test('transfer form blocks invalid submissions @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    transferPage,
    page
  }) => {
    await loginAsPrimaryUser({ appConfig, loginPage, dashboardPage });

    await transferPage.goto();
    await transferPage.waitForReady();
    await transferPage.continue();
    await expect(await transferPage.getErrorText('destinationId')).toContain(
      'Select a destination.'
    );
    await expect(await transferPage.getErrorText('amount')).toContain(
      'Enter an amount greater than zero.'
    );
    await expect(await transferPage.getErrorText('reference')).toContain(
      'Enter a payment reference.'
    );

    await transferPage.fillTransferForm({
      destinationType: 'own',
      destinationId: 'acct-saver',
      amount: '99999',
      reference: 'TOO MUCH'
    });
    await transferPage.continue();
    await expect(await transferPage.getErrorText('amount')).toContain(
      'Amount exceeds the available balance.'
    );
    await expect(page).toHaveURL(/\/transfers$/);
  });

  test('customer can transfer immediately between own accounts and see updated balances @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    transferPage,
    transferReviewPage,
    transactionsPage,
    page
  }) => {
    await loginAsPrimaryUser({ appConfig, loginPage, dashboardPage });
    await expect(await dashboardPage.getAccountRowText('everyday')).toContain('$6,842.73');
    await expect(await dashboardPage.getAccountRowText('saver')).toContain('$24,560.11');

    await transferPage.goto();
    await transferPage.waitForReady();
    await transferPage.fillTransferForm({
      fromAccountId: 'acct-everyday',
      destinationType: 'own',
      destinationId: 'acct-saver',
      amount: '125.00',
      reference: 'AUTO OWN 125',
      note: 'Regression transfer'
    });
    await transferPage.continue();

    await transferReviewPage.waitForReady();
    await transferReviewPage.confirmTransfer();
    await transferReviewPage.waitForSuccessModal();
    await expect(await transferReviewPage.getSuccessReceipt()).not.toEqual('');
    await expect(await transferReviewPage.getSuccessText()).toContain('Transfer successful');
    await expect(await transferReviewPage.getSuccessText()).toContain('Completed');

    await transferReviewPage.backToDashboard();
    await dashboardPage.waitForReady();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(await dashboardPage.getAccountRowText('everyday')).toContain('$6,717.73');
    await expect(await dashboardPage.getAccountRowText('saver')).toContain('$24,685.11');

    await transactionsPage.goto();
    await transactionsPage.waitForReady();
    await transactionsPage.search('AUTO OWN 125');
    await expect(await transactionsPage.getTableText()).toContain('Transfer to Online Saver');
    await expect(await transactionsPage.getTableText()).toContain('AUTO OWN 125');
  });

  test('future dated payee transfer remains pending and appears in transaction history @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    transferPage,
    transferReviewPage,
    transactionsPage
  }) => {
    await loginAsPrimaryUser({ appConfig, loginPage, dashboardPage });

    await transferPage.goto();
    await transferPage.waitForReady();
    await transferPage.fillTransferForm({
      fromAccountId: 'acct-everyday',
      destinationType: 'payee',
      destinationId: 'payee-energy',
      amount: '80.00',
      reference: 'AUTO FUTURE 80',
      note: 'Future payment regression',
      transferDateType: 'future',
      scheduledDate: futureDate(5)
    });
    await transferPage.continue();

    await transferReviewPage.waitForReady();
    await transferReviewPage.confirmTransfer();
    await transferReviewPage.waitForSuccessModal();
    await expect(await transferReviewPage.getSuccessText()).toContain('Pending');
    await expect(await transferReviewPage.getSuccessText()).toContain(
      'Metro Energy Services'
    );

    await transferReviewPage.makeAnotherTransfer();
    await transferPage.waitForReady();

    await transactionsPage.goto();
    await transactionsPage.waitForReady();
    await transactionsPage.search('AUTO FUTURE 80');
    await transactionsPage.filterStatus('Pending');
    await expect(await transactionsPage.getTableText()).toContain('Payment to Metro Energy Services');
    await expect(await transactionsPage.getTableText()).toContain('AUTO FUTURE 80');
  });
});

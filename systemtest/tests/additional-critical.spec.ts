import { expect, test } from '../fixtures/test-fixtures';

async function loginAs(
  customerId: string,
  password: string,
  loginPage: { goto: () => Promise<void>; login: (customerId: string, password: string) => Promise<void> },
  dashboardPage: { waitForReady: () => Promise<void> }
): Promise<void> {
  await loginPage.goto();
  await loginPage.login(customerId, password);
  await dashboardPage.waitForReady();
}

test.describe('BluLedger additional critical behaviors', () => {
  test('transfer review route redirects back to transfers when no draft exists @critical', async ({
    loginPage,
    dashboardPage,
    transferPage,
    transferReviewPage,
    page
  }) => {
    await loginAs('92718463', 'Harbour!92', loginPage, dashboardPage);

    await transferReviewPage.goto();
    await transferPage.waitForReady();
    await expect(page).toHaveURL(/\/transfers$/);
  });

  test('transfer draft is preserved when navigating back from review @critical', async ({
    loginPage,
    dashboardPage,
    transferPage,
    transferReviewPage,
    page
  }) => {
    await loginAs('92718463', 'Harbour!92', loginPage, dashboardPage);

    await transferPage.goto();
    await transferPage.waitForReady();
    await transferPage.fillTransferForm({
      fromAccountId: 'acct-offset',
      destinationType: 'payee',
      destinationId: 'payee-family',
      amount: '315.45',
      reference: 'SAVE BACKFLOW',
      note: 'Review back persistence'
    });
    await transferPage.continue();

    await transferReviewPage.waitForReady();
    await transferReviewPage.backToTransferForm();
    await transferPage.waitForReady();
    await expect(page).toHaveURL(/\/transfers$/);
    await expect(await transferPage.getFieldValue('fromAccountId')).toBe('acct-offset');
    await expect(await transferPage.getFieldValue('destinationType')).toBe('payee');
    await expect(await transferPage.getFieldValue('destinationId')).toBe('payee-family');
    await expect(await transferPage.getFieldValue('amount')).toBe('315.45');
    await expect(await transferPage.getFieldValue('reference')).toBe('SAVE BACKFLOW');
    await expect(await transferPage.getFieldValue('note')).toBe('Review back persistence');
  });

  test('large transfer amounts show the review warning hint @critical', async ({
    loginPage,
    dashboardPage,
    transferPage
  }) => {
    await loginAs('92718463', 'Harbour!92', loginPage, dashboardPage);

    await transferPage.goto();
    await transferPage.waitForReady();
    await transferPage.fillTransferForm({
      amount: '2500.01'
    });
    await expect(await transferPage.getAmountHint()).toContain(
      'above your usual transfer threshold'
    );
  });

  test('make another transfer from the success modal returns to a fresh transfer form @critical', async ({
    loginPage,
    dashboardPage,
    transferPage,
    transferReviewPage,
    page
  }) => {
    await loginAs('92718463', 'Harbour!92', loginPage, dashboardPage);

    await transferPage.goto();
    await transferPage.waitForReady();
    await transferPage.fillTransferForm({
      fromAccountId: 'acct-everyday',
      destinationType: 'payee',
      destinationId: 'payee-rent',
      amount: '50.00',
      reference: 'ANOTHER XFER',
      note: 'Modal nav check'
    });
    await transferPage.continue();

    await transferReviewPage.waitForReady();
    await transferReviewPage.confirmTransfer();
    await transferReviewPage.waitForSuccessModal();
    await transferReviewPage.makeAnotherTransfer();
    await transferPage.waitForReady();
    await expect(page).toHaveURL(/\/transfers$/);
    await expect(await transferPage.getFieldValue('destinationId')).toBe('');
    await expect(await transferPage.getFieldValue('amount')).toBe('');
    await expect(await transferPage.getFieldValue('reference')).toBe('');
  });

  test('deposit-only customer sees the no active cards empty state @critical', async ({
    loginPage,
    dashboardPage,
    cardsPage
  }) => {
    await loginAs('61844027', 'Quartz!61', loginPage, dashboardPage);

    await cardsPage.goto();
    await cardsPage.waitForReady();
    await expect(await cardsPage.getEmptyStateText()).toContain('No active cards');
    await expect(await cardsPage.getEmptyStateText()).toContain(
      'No debit or credit cards are linked to this profile.'
    );
  });
});

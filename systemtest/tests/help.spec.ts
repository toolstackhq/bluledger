import { expect, test } from '../fixtures/test-fixtures';

async function loginAsPrimaryUser({
  appConfig,
  dashboardPage,
  loginPage
}: {
  appConfig: { credentials: { username: string; password: string } };
  dashboardPage: { waitForReady: () => Promise<void> };
  loginPage: { goto: () => Promise<void>; login: (customerId: string, password: string) => Promise<void> };
}): Promise<void> {
  await loginPage.goto();
  await loginPage.login(appConfig.credentials.username, appConfig.credentials.password);
  await dashboardPage.waitForReady();
}

test.describe('BluLedger help centre', () => {
  test('contact us embeds a same-origin iframe form and mirrors the submission on the host page @regression', async ({
    appConfig,
    dashboardPage,
    helpPage,
    loginPage,
    page
  }) => {
    await loginAsPrimaryUser({ appConfig, dashboardPage, loginPage });

    await helpPage.gotoContactUs();
    await expect(page).toHaveURL(/\/help\/contact-us$/);

    await helpPage.submitEmbeddedContactRequest({
      topic: 'card-support',
      preferredChannel: 'Secure message',
      message: 'My replacement card still shows the previous control settings.'
    });

    await expect(await helpPage.getEmbeddedContactStatus()).toContain(
      'Support request queued for review.'
    );
    await expect(await helpPage.getContactSummaryText()).toContain('card-support');
    await expect(await helpPage.getContactSummaryText()).toContain('Secure message');
    await expect(await helpPage.getContactSummaryText()).toContain(
      'My replacement card still shows the previous control settings.'
    );
  });

  test('feedback uses the help subnav and submits through an open shadow widget @regression', async ({
    appConfig,
    dashboardPage,
    helpPage,
    loginPage,
    page
  }) => {
    await loginAsPrimaryUser({ appConfig, dashboardPage, loginPage });

    await helpPage.gotoContactUs();
    await helpPage.openSection('Feedback');
    await expect(page).toHaveURL(/\/help\/feedback$/);

    await helpPage.submitFeedback({
      category: 'accessibility',
      rating: 'needs-work',
      summary: 'The secure support workflow should announce status updates more clearly.',
      allowFollowUp: true
    });

    await expect(await helpPage.getFeedbackStatus()).toContain(
      'Feedback captured for the BluLedger service desk.'
    );
    await expect(await helpPage.getFeedbackSummaryText()).toContain('accessibility');
    await expect(await helpPage.getFeedbackSummaryText()).toContain('needs-work');
    await expect(await helpPage.getFeedbackSummaryText()).toContain('Allowed');
    await expect(await helpPage.getFeedbackSummaryText()).toContain(
      'The secure support workflow should announce status updates more clearly.'
    );
  });
});

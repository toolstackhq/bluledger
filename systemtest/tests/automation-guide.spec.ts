import { expect, test } from '../fixtures/test-fixtures';

test.describe('BluLedger automation guide', () => {
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

  test('launcher explains the shadow DOM training surface for Cypress users from the login page @regression', async ({
    automationGuideWidget,
    loginPage,
    page
  }) => {
    await loginPage.goto();
    await expect(page).toHaveURL(/\/login$/);

    await automationGuideWidget.open();
    await automationGuideWidget.chooseFramework('Cypress');
    await automationGuideWidget.chooseTopic('automate shadow dom');

    await expect(await automationGuideWidget.getAnswerText('shadow-dom-feedback')).toContain(
      'Help > Feedback'
    );
    await expect(await automationGuideWidget.getAnswerText('shadow-dom-feedback')).toContain(
      'open shadow root'
    );
    await expect(await automationGuideWidget.getCodeText('shadow-dom-feedback')).toContain(
      "cy.get('blu-feedback-widget').shadow()"
    );
  });

  test('authenticated users can open a guide link and navigate straight to the training route @regression', async ({
    appConfig,
    automationGuideWidget,
    dashboardPage,
    loginPage,
    page
  }) => {
    await loginAsPrimaryUser({ appConfig, dashboardPage, loginPage });
    await expect(page).toHaveURL(/\/dashboard$/);

    await automationGuideWidget.open();
    await automationGuideWidget.chooseFramework('Playwright');
    await automationGuideWidget.chooseTopic('automate iframe');

    await expect(await automationGuideWidget.getAnswerText('iframe-contact')).toContain(
      'Help > Contact Us'
    );
    await expect(await automationGuideWidget.getAnswerText('iframe-contact')).toContain(
      'same-origin iframe'
    );
    await expect(await automationGuideWidget.getCodeText('iframe-contact')).toContain(
      "page.frameLocator('[data-testid=\"help-contact-frame\"]')"
    );
    await automationGuideWidget.openRoute('iframe-contact');
    await expect(page).toHaveURL(/\/help\/contact-us$/);
  });

  test('closing the guide hides it for the rest of the current session @regression', async ({
    appConfig,
    automationGuideWidget,
    dashboardPage,
    loginPage,
    page
  }) => {
    await loginPage.goto();
    await expect(await automationGuideWidget.isLauncherVisible()).toBe(true);

    await automationGuideWidget.open();
    await automationGuideWidget.closeForSession();
    await expect(await automationGuideWidget.isLauncherHidden()).toBe(true);

    await loginPage.login(
      appConfig.credentials.username,
      appConfig.credentials.password
    );
    await dashboardPage.waitForReady();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(await automationGuideWidget.isLauncherHidden()).toBe(true);
  });
});

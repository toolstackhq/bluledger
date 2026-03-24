import { expect, test } from '../fixtures/test-fixtures';

test.describe('BluLedger automation guide', () => {
  test('login page explains the shadow DOM training surface for Cypress users @regression', async ({
    loginPage,
    page
  }) => {
    await loginPage.goto();
    await expect(page).toHaveURL(/\/login$/);

    await loginPage.openAutomationGuide();
    await loginPage.chooseAutomationFramework('Cypress');
    await loginPage.chooseAutomationTopic('automate shadow dom');

    await expect(await loginPage.getAutomationAnswerText('shadow-dom-feedback')).toContain(
      'Help > Feedback'
    );
    await expect(await loginPage.getAutomationAnswerText('shadow-dom-feedback')).toContain(
      'open shadow root'
    );
    await expect(await loginPage.getAutomationCodeText('shadow-dom-feedback')).toContain(
      "cy.get('blu-feedback-widget').shadow()"
    );
  });

  test('login page explains the iframe training surface for Playwright users @regression', async ({
    loginPage,
    page
  }) => {
    await loginPage.goto();
    await expect(page).toHaveURL(/\/login$/);

    await loginPage.openAutomationGuide();
    await loginPage.chooseAutomationFramework('Playwright');
    await loginPage.chooseAutomationTopic('automate iframe');

    await expect(await loginPage.getAutomationAnswerText('iframe-contact')).toContain(
      'Help > Contact Us'
    );
    await expect(await loginPage.getAutomationAnswerText('iframe-contact')).toContain(
      'same-origin iframe'
    );
    await expect(await loginPage.getAutomationCodeText('iframe-contact')).toContain(
      "page.frameLocator('[data-testid=\"help-contact-frame\"]')"
    );
  });
});

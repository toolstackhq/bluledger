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

test.describe('BluLedger customer and card management', () => {
  test('card controls update card state and persist after reload @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    cardsPage,
    appShellPage,
    page
  }) => {
    await loginAsPrimaryUser({ appConfig, loginPage, dashboardPage });

    await cardsPage.goto();
    await cardsPage.waitForReady();
    await cardsPage.revealCardNumber('card-primary');
    await expect(await cardsPage.getCardNumber('card-primary')).toContain(
      '4929180024001844'
    );
    await cardsPage.saveNickname('card-primary', 'Travel Debit');
    await expect(await appShellPage.getToastText()).toContain('Card nickname updated.');
    await cardsPage.setInternationalUsage('card-primary', false);
    await expect(await appShellPage.getToastText()).toContain(
      'International usage preference updated.'
    );
    await cardsPage.toggleLock('card-primary');
    await expect(await appShellPage.getToastText()).toContain('Card locked.');
    await cardsPage.viewLimits('card-primary');
    await expect(await appShellPage.getToastText()).toContain(
      'Travel Debit: ATM 1200 AUD, online 2500 AUD.'
    );

    await page.reload();
    await cardsPage.waitForReady();
    await expect(await cardsPage.getCardText('card-primary')).toContain('Travel Debit');
    await expect(await cardsPage.getCardText('card-primary')).toContain('Locked');
    await expect(await cardsPage.isInternationalUsageEnabled('card-primary')).toBe(false);
    await expect(await cardsPage.getNicknameValue('card-primary')).toBe('Travel Debit');
  });

  test('profile details validate input, save successfully, and persist after reload @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    profilePage,
    appShellPage,
    page
  }) => {
    await loginAsPrimaryUser({ appConfig, loginPage, dashboardPage });

    await profilePage.goto();
    await profilePage.waitForReady();
    await profilePage.updateProfile({
      email: 'invalid-email',
      mobile: '12345',
      postcode: '99'
    });
    await profilePage.save();
    await expect(await profilePage.getErrorText('email')).toContain(
      'Enter a valid email address.'
    );
    await expect(await profilePage.getErrorText('mobile')).toContain(
      'Enter a valid Australian mobile number.'
    );
    await expect(await profilePage.getErrorText('postcode')).toContain(
      'Enter a valid postcode.'
    );

    await profilePage.updateProfile({
      email: 'alicia.updated@bluledger-demo.au',
      mobile: '0412555000',
      postcode: '3000',
      preferredName: 'Ali'
    });
    await profilePage.save();
    await expect(await appShellPage.getToastText()).toContain(
      'Your details have been updated.'
    );

    await page.reload();
    await profilePage.waitForReady();
    await expect(await profilePage.getFieldValue('email')).toBe(
      'alicia.updated@bluledger-demo.au'
    );
    await expect(await profilePage.getFieldValue('mobile')).toBe('0412555000');
    await expect(await profilePage.getFieldValue('postcode')).toBe('3000');
    await expect(await profilePage.getFieldValue('preferredName')).toBe('Ali');
  });

  test('settings changes save successfully and persist after reload @critical', async ({
    appConfig,
    loginPage,
    dashboardPage,
    settingsPage,
    appShellPage,
    page
  }) => {
    await loginAsPrimaryUser({ appConfig, loginPage, dashboardPage });

    await settingsPage.goto();
    await settingsPage.waitForReady();
    await settingsPage.setCheckbox('settings-sms-alerts', false);
    await settingsPage.setCheckbox('settings-email-notifications', false);
    await settingsPage.selectOption('statementDelivery', 'Secure mail');
    await settingsPage.selectOption('sessionTimeout', '15');
    await settingsPage.selectOption('preferredContact', 'Mobile');
    await settingsPage.setCheckbox('settings-dark-mode', true);
    await settingsPage.save();
    await expect(await appShellPage.getToastText()).toContain('Preferences saved.');

    await page.reload();
    await settingsPage.waitForReady();
    await expect(await settingsPage.isChecked('settings-sms-alerts')).toBe(false);
    await expect(await settingsPage.isChecked('settings-email-notifications')).toBe(false);
    await expect(await settingsPage.getSelectValue('statementDelivery')).toBe(
      'Secure mail'
    );
    await expect(await settingsPage.getSelectValue('sessionTimeout')).toBe('15');
    await expect(await settingsPage.getSelectValue('preferredContact')).toBe('Mobile');
    await expect(await settingsPage.isChecked('settings-dark-mode')).toBe(true);
  });
});

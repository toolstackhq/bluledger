// Page object for the login screen and its user actions.
import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'login' });
    await this.page.goto(this.buildUrl('/login'), { waitUntil: 'domcontentloaded' });
    await this.page.getByTestId('login-customer-id').waitFor();
  }

  async isSubmitVisible(): Promise<boolean> {
    return await this.page.getByTestId('login-submit').isVisible();
  }

  async openAutomationGuide(): Promise<void> {
    await this.page.getByTestId('login-open-automation-guide').click();
    await this.page.getByTestId('automation-guide-drawer').waitFor();
  }

  async chooseAutomationFramework(name: string): Promise<void> {
    await this.page
      .getByTestId('automation-guide-frameworks')
      .getByRole('button', { name })
      .click();
  }

  async chooseAutomationTopic(topicLabel: string): Promise<void> {
    await this.page
      .getByTestId('automation-guide-topics')
      .getByRole('button', { name: topicLabel })
      .click();
  }

  async getAutomationAnswerText(topicId: string): Promise<string> {
    return (
      (await this.page.getByTestId(`automation-guide-answer-${topicId}`).textContent()) ?? ''
    );
  }

  async getAutomationCodeText(topicId: string): Promise<string> {
    return (
      (await this.page.getByTestId(`automation-guide-code-${topicId}`).textContent()) ?? ''
    );
  }

  async setRememberCustomerId(enabled: boolean): Promise<void> {
    const checkbox = this.page.locator('#rememberCustomerId');
    if ((await checkbox.isChecked()) !== enabled) {
      await checkbox.click();
    }
  }

  async login(customerId: string, password: string): Promise<void> {
    this.logger.info('login.submit', { customerId });
    await this.page.getByTestId('login-customer-id').waitFor();
    await this.page.getByTestId('login-customer-id').fill(customerId);
    await this.page.getByTestId('login-password').fill(password);
    await this.submit();
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('login-submit').click();
  }

  async openTestUsersModal(): Promise<void> {
    await this.page.getByTestId('login-view-test-users').click();
    await this.page.getByTestId('login-test-users-modal').waitFor();
  }

  async chooseTestUser(index: number): Promise<void> {
    await this.page.locator(`#test-user-prefill-${index}`).click();
  }

  async getCustomerIdValue(): Promise<string> {
    return await this.page.getByTestId('login-customer-id').inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.page.getByTestId('login-password').inputValue();
  }

  async getFormError(): Promise<string> {
    return (await this.page.locator('#login-form-error').textContent()) ?? '';
  }
}

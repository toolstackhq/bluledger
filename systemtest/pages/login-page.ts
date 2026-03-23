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
    await this.page.goto(this.buildUrl('/login'));
  }

  async login(customerId: string, password: string): Promise<void> {
    this.logger.info('login.submit', { customerId });
    await this.page.getByTestId('login-customer-id').fill(customerId);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-submit').click();
  }

  async getFormError(): Promise<string> {
    return (await this.page.locator('#login-form-error').textContent()) ?? '';
  }
}

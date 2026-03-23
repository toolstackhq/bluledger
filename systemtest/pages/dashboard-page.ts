import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class DashboardPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'dashboard' });
    await this.page.goto(this.buildUrl('/dashboard'));
  }

  async waitForReady(): Promise<void> {
    this.logger.info('page.ready', { page: 'dashboard' });
    await this.page
      .getByRole('heading', { level: 1, name: 'Account Summary' })
      .waitFor();
  }

  async getSignedInCustomerName(): Promise<string> {
    return (await this.page.locator('#active-customer-name').textContent()) ?? '';
  }

  async getAccountRowText(accountSlug: string): Promise<string> {
    return (
      (await this.page.getByTestId(`dashboard-account-row-${accountSlug}`).textContent()) ?? ''
    );
  }

  async openQuickTransfer(): Promise<void> {
    await this.page.getByTestId('quick-link-transfer').click();
  }

  async openAccountTransfer(accountId: string): Promise<void> {
    await this.page.locator(`#account-transfer-link-${accountId}`).click();
  }
}

import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class TransactionsPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'transactions' });
    await this.page.goto(this.buildUrl('/transactions'));
  }

  async waitForReady(): Promise<void> {
    await this.page
      .getByRole('heading', { level: 1, name: 'Transactions' })
      .waitFor();
  }

  async search(term: string): Promise<void> {
    await this.page.getByTestId('transactions-search').fill(term);
  }

  async filterAccount(accountId: string): Promise<void> {
    await this.page.getByTestId('transactions-account-filter').selectOption(accountId);
  }

  async filterType(type: string): Promise<void> {
    await this.page.locator('#transaction-type').selectOption(type);
  }

  async filterStatus(status: string): Promise<void> {
    await this.page.locator('#transaction-status').selectOption(status);
  }

  async loadMore(): Promise<void> {
    await this.page.locator('#transactions-load-more-button').click();
  }

  async getVisibleRowCount(): Promise<number> {
    return await this.page.locator('tbody tr').count();
  }

  async getTableText(): Promise<string> {
    return (await this.page.locator('table.data-table').textContent()) ?? '';
  }

  async getEmptyStateText(): Promise<string> {
    return (await this.page.locator('.empty-state').textContent()) ?? '';
  }
}

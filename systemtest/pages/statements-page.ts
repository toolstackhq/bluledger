import type { Download, Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class StatementsPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'statements' });
    await this.page.goto(this.buildUrl('/statements'));
  }

  async waitForReady(): Promise<void> {
    await this.page.getByRole('heading', { level: 1, name: 'Statements' }).waitFor();
  }

  async selectAccount(accountId: string): Promise<void> {
    await this.page.getByTestId('statement-account-filter').selectOption(accountId);
  }

  async selectPeriod(statementId: string): Promise<void> {
    await this.page.getByTestId('statement-period-filter').selectOption(statementId);
  }

  async downloadCsv(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByTestId('statement-download-csv').click()
    ]);

    return download;
  }

  async downloadPdf(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByTestId('statement-download-pdf').click()
    ]);

    return download;
  }

  async getPageText(): Promise<string> {
    return (await this.page.locator('main').textContent()) ?? '';
  }
}

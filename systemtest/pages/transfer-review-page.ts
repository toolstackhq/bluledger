import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class TransferReviewPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'transfer-review' });
    await this.page.goto(this.buildUrl('/transfers/review'));
  }

  async waitForReady(): Promise<void> {
    await this.page
      .getByRole('heading', { level: 1, name: 'Transfer Review' })
      .waitFor();
  }

  async confirmTransfer(): Promise<void> {
    await this.page.getByTestId('transfer-confirm').click();
  }

  async waitForSuccessModal(): Promise<void> {
    await this.page.getByTestId('transfer-success-modal').waitFor();
  }

  async getSuccessReceipt(): Promise<string> {
    return (await this.page.getByTestId('transfer-success-receipt').textContent()) ?? '';
  }

  async getSuccessText(): Promise<string> {
    return (await this.page.getByTestId('transfer-success-modal').textContent()) ?? '';
  }

  async backToDashboard(): Promise<void> {
    await this.page.locator('#transfer-success-dashboard-button').click();
  }

  async makeAnotherTransfer(): Promise<void> {
    await this.page.locator('#transfer-success-another-button').click();
  }

  async backToTransferForm(): Promise<void> {
    await this.page.locator('#transfer-review-back-button').click();
  }
}

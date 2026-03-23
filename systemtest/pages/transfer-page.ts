import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

type TransferDraftInput = {
  fromAccountId?: string;
  destinationType?: 'own' | 'payee';
  destinationId?: string;
  amount?: string;
  reference?: string;
  note?: string;
  transferDateType?: 'today' | 'future';
  scheduledDate?: string;
};

export class TransferPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'transfers' });
    await this.page.goto(this.buildUrl('/transfers'));
  }

  async waitForReady(): Promise<void> {
    await this.page
      .getByRole('heading', { level: 1, name: 'Transfer Money' })
      .waitFor();
  }

  async fillTransferForm(input: TransferDraftInput): Promise<void> {
    if (input.fromAccountId) {
      await this.page.getByTestId('transfer-from-account').selectOption(input.fromAccountId);
    }

    if (input.destinationType) {
      await this.page
        .getByTestId('transfer-destination-type')
        .selectOption(input.destinationType);
    }

    if (input.destinationId) {
      await this.page.locator('#destinationId').selectOption(input.destinationId);
    }

    if (input.amount !== undefined) {
      await this.page.getByTestId('transfer-amount').fill(input.amount);
    }

    if (input.reference !== undefined) {
      await this.page.getByTestId('transfer-reference').fill(input.reference);
    }

    if (input.note !== undefined) {
      await this.page.getByTestId('transfer-note').fill(input.note);
    }

    if (input.transferDateType) {
      await this.page.getByTestId('transfer-date').selectOption(input.transferDateType);
    }

    if (input.scheduledDate !== undefined) {
      await this.page.locator('#scheduledDate').fill(input.scheduledDate);
    }
  }

  async continue(): Promise<void> {
    await this.page.getByTestId('transfer-continue').click();
  }

  async getErrorText(field: 'destinationId' | 'amount' | 'reference' | 'scheduledDate'): Promise<string> {
    return (await this.page.locator(`#${field}-error`).textContent()) ?? '';
  }

  async getAmountHint(): Promise<string> {
    const amountRow = this.page.locator('#amount').locator('..');
    return (await amountRow.locator('.form-hint').first().textContent()) ?? '';
  }
}

import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class CardsPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'cards' });
    await this.page.goto(this.buildUrl('/cards'));
  }

  async waitForReady(): Promise<void> {
    await this.page.getByRole('heading', { level: 1, name: 'Cards' }).waitFor();
  }

  async revealCardNumber(cardId: string): Promise<void> {
    await this.page.getByTestId(`card-reveal-number-${cardId}`).click();
  }

  async getCardNumber(cardId: string): Promise<string> {
    return (
      (await this.page.locator(`#card-number-${cardId}`).textContent())?.replace(/\s+/g, ' ').trim() ?? ''
    );
  }

  async saveNickname(cardId: string, nickname: string): Promise<void> {
    await this.page.locator(`#nickname-${cardId}`).fill(nickname);
    await this.page.locator(`#nickname-save-${cardId}`).click();
  }

  async setInternationalUsage(cardId: string, enabled: boolean): Promise<void> {
    const checkbox = this.page.locator(`#international-${cardId}`);
    if ((await checkbox.isChecked()) !== enabled) {
      await checkbox.click();
    }
  }

  async isInternationalUsageEnabled(cardId: string): Promise<boolean> {
    return await this.page.locator(`#international-${cardId}`).isChecked();
  }

  async toggleLock(cardId: string): Promise<void> {
    await this.page.locator(`#card-lock-toggle-${cardId}`).click();
  }

  async viewLimits(cardId: string): Promise<void> {
    await this.page.locator(`#card-view-limits-button-${cardId}`).click();
  }

  async getCardText(cardId: string): Promise<string> {
    return (await this.page.locator(`#card-title-${cardId}`).locator('..').locator('..').textContent()) ?? '';
  }

  async getNicknameValue(cardId: string): Promise<string> {
    return await this.page.locator(`#nickname-${cardId}`).inputValue();
  }

  async getEmptyStateText(): Promise<string> {
    return (await this.page.locator('.empty-state').textContent()) ?? '';
  }
}

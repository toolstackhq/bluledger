import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class SettingsPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'settings' });
    await this.page.goto(this.buildUrl('/settings'));
  }

  async waitForReady(): Promise<void> {
    await this.page.getByRole('heading', { level: 1, name: 'Settings' }).waitFor();
  }

  async setCheckbox(id: string, enabled: boolean): Promise<void> {
    const checkbox = this.page.locator(`#${id}`);
    if ((await checkbox.isChecked()) !== enabled) {
      await checkbox.click();
    }
  }

  async selectOption(id: string, value: string): Promise<void> {
    await this.page.locator(`#${id}`).selectOption(value);
  }

  async save(): Promise<void> {
    await this.page.getByTestId('settings-save').click();
  }

  async isChecked(id: string): Promise<boolean> {
    return await this.page.locator(`#${id}`).isChecked();
  }

  async getSelectValue(id: string): Promise<string> {
    return await this.page.locator(`#${id}`).inputValue();
  }
}

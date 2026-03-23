import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class AppShellPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async logout(): Promise<void> {
    this.logger.info('session.logout');
    await this.page.getByTestId('logout-button').click();
  }

  async getToastText(): Promise<string> {
    await this.page.getByRole('status').waitFor();
    return (await this.page.getByRole('status').textContent()) ?? '';
  }
}

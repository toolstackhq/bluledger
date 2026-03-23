import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

export class NotFoundPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(pathname: string): Promise<void> {
    this.logger.info('page.goto', { page: 'not-found', pathname });
    await this.page.goto(this.buildUrl(pathname));
  }

  async waitForReady(): Promise<void> {
    await this.page
      .getByRole('heading', { level: 1, name: 'Page not found' })
      .waitFor();
  }

  async returnToSignIn(): Promise<void> {
    await this.page.locator('#not-found-sign-in-link').click();
  }

  async backToDashboard(): Promise<void> {
    await this.page.locator('#not-found-dashboard-link').click();
  }
}

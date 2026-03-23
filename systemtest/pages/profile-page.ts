import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

type ProfileUpdates = Partial<Record<
  | 'fullName'
  | 'preferredName'
  | 'email'
  | 'mobile'
  | 'preferredContactMethod'
  | 'addressLine1'
  | 'suburb'
  | 'state'
  | 'postcode'
  | 'employer'
  | 'occupation',
  string
>>;

export class ProfilePage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async goto(): Promise<void> {
    this.logger.info('page.goto', { page: 'profile' });
    await this.page.goto(this.buildUrl('/profile'));
  }

  async waitForReady(): Promise<void> {
    await this.page
      .getByRole('heading', { level: 1, name: 'My Details' })
      .waitFor();
  }

  async updateProfile(updates: ProfileUpdates): Promise<void> {
    for (const [field, value] of Object.entries(updates)) {
      if (field === 'preferredContactMethod' || field === 'state') {
        await this.page.locator(`#${field}`).selectOption(value);
      } else {
        await this.page.locator(`#${field}`).fill(value);
      }
    }
  }

  async save(): Promise<void> {
    await this.page.getByTestId('profile-save').click();
  }

  async getErrorText(field: 'fullName' | 'email' | 'mobile' | 'postcode'): Promise<string> {
    return (await this.page.locator(`#${field}-error`).textContent()) ?? '';
  }

  async getFieldValue(field: string): Promise<string> {
    return await this.page.locator(`#${field}`).inputValue();
  }
}

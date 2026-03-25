import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';
import { BasePage } from './base-page';

type EmbeddedContactRequest = {
  topic: string;
  preferredChannel: string;
  message: string;
};

type FeedbackSubmission = {
  category: string;
  rating: string;
  summary: string;
  allowFollowUp: boolean;
};

export class HelpPage extends BasePage {
  constructor(page: Page, baseUrl: string, logger: Logger) {
    super(page, baseUrl, logger);
  }

  async gotoContactUs(): Promise<void> {
    this.logger.info('page.goto', { page: 'help-contact' });
    await this.page.goto(this.buildUrl('/help/contact-us'));
    await this.page.getByTestId('help-contact-panel').waitFor();
  }

  async gotoFeedback(): Promise<void> {
    this.logger.info('page.goto', { page: 'help-feedback' });
    await this.page.goto(this.buildUrl('/help/feedback'));
    await this.page.getByTestId('help-feedback-panel').waitFor();
  }

  async gotoEnvironmentStatus(): Promise<void> {
    this.logger.info('page.goto', { page: 'help-environment-status' });
    await this.page.goto(this.buildUrl('/help/environment-status'));
    await this.page.getByTestId('help-environment-status-panel').waitFor();
  }

  async openSection(sectionName: string): Promise<void> {
    await this.page.getByTestId('help-section-nav').getByRole('link', { name: sectionName }).click();
  }

  async submitEmbeddedContactRequest(request: EmbeddedContactRequest): Promise<void> {
    const frame = this.page.frameLocator('[data-testid="help-contact-frame"]');

    await frame.getByTestId('contact-topic').selectOption(request.topic);
    await frame.getByTestId('contact-preferred-channel').selectOption(request.preferredChannel);
    await frame.getByTestId('contact-message').fill(request.message);
    await frame.getByTestId('contact-submit').click();
  }

  async getEmbeddedContactStatus(): Promise<string> {
    const frame = this.page.frameLocator('[data-testid="help-contact-frame"]');
    return (await frame.getByTestId('contact-status').textContent()) ?? '';
  }

  async getContactSummaryText(): Promise<string> {
    return (await this.page.getByTestId('help-contact-summary').textContent()) ?? '';
  }

  async submitFeedback(submission: FeedbackSubmission): Promise<void> {
    await this.page.getByTestId('feedback-category').selectOption(submission.category);
    await this.page.getByTestId('feedback-rating').selectOption(submission.rating);
    await this.page.getByTestId('feedback-summary').fill(submission.summary);

    const followUpCheckbox = this.page.getByTestId('feedback-follow-up');
    if ((await followUpCheckbox.isChecked()) !== submission.allowFollowUp) {
      await followUpCheckbox.click();
    }

    await this.page.getByTestId('feedback-submit').click();
  }

  async getFeedbackStatus(): Promise<string> {
    return (await this.page.getByTestId('feedback-status').textContent()) ?? '';
  }

  async getFeedbackSummaryText(): Promise<string> {
    return (await this.page.getByTestId('help-feedback-summary').textContent()) ?? '';
  }

  async waitForEnvironmentStatusError(): Promise<void> {
    await this.page.getByTestId('help-environment-status-error').waitFor();
  }

  async retryEnvironmentStatus(): Promise<void> {
    await this.page.getByTestId('help-environment-status-retry').click();
  }

  async waitForEnvironmentStatusContent(): Promise<void> {
    await this.page.getByTestId('help-environment-status-content').waitFor();
  }

  async getEnvironmentStatusErrorText(): Promise<string> {
    return (await this.page.getByTestId('help-environment-status-error').textContent()) ?? '';
  }

  async getEnvironmentStatusAttemptText(): Promise<string> {
    return (await this.page.getByTestId('help-environment-status-attempt').textContent()) ?? '';
  }

  async getEnvironmentStatusContentText(): Promise<string> {
    return (await this.page.getByTestId('help-environment-status-content').textContent()) ?? '';
  }
}

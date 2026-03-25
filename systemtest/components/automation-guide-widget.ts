import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';

export class AutomationGuideWidget {
  constructor(
    private readonly page: Page,
    private readonly logger: Logger
  ) {}

  async open(): Promise<void> {
    this.logger.info('widget.open', { widget: 'automation-guide' });
    await this.page.getByTestId('automation-guide-launcher').click();
    await this.page.getByTestId('automation-guide-drawer').waitFor();
  }

  async minimize(): Promise<void> {
    await this.page.getByTestId('automation-guide-minimize').click();
    await this.page.getByTestId('automation-guide-drawer').waitFor({ state: 'hidden' });
  }

  async closeForSession(): Promise<void> {
    await this.page.getByTestId('automation-guide-close-session').click();
    await this.page.getByTestId('automation-guide-drawer').waitFor({ state: 'hidden' });
  }

  async chooseFramework(name: string): Promise<void> {
    await this.page
      .getByTestId('automation-guide-frameworks')
      .getByRole('button', { name })
      .click();
  }

  async chooseTopic(topicLabel: string): Promise<void> {
    await this.page
      .getByTestId('automation-guide-topics')
      .getByRole('button', { name: topicLabel })
      .click();
  }

  async openRoute(topicId: string): Promise<void> {
    await this.page.getByTestId(`automation-guide-route-${topicId}`).click();
  }

  async getAnswerText(topicId: string): Promise<string> {
    return (
      (await this.page.getByTestId(`automation-guide-answer-${topicId}`).textContent()) ?? ''
    );
  }

  async getCodeText(topicId: string): Promise<string> {
    return (
      (await this.page.getByTestId(`automation-guide-code-${topicId}`).textContent()) ?? ''
    );
  }

  async isLauncherVisible(): Promise<boolean> {
    return await this.page.getByTestId('automation-guide-launcher').isVisible();
  }

  async isLauncherHidden(): Promise<boolean> {
    return await this.page.getByTestId('automation-guide-launcher').isHidden();
  }
}

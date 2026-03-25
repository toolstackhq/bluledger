// Shared Playwright fixtures so tests can stay small and focus on behavior.
import { test as base } from '@playwright/test';

import {
  loadRuntimeConfig,
  type RuntimeConfig
} from '../config/runtime-config';
import { AppShellPage } from '../pages/app-shell-page';
import { AutomationGuideWidget } from '../components/automation-guide-widget';
import { CardsPage } from '../pages/cards-page';
import { DataFactory } from '../data/factories/data-factory';
import { DashboardPage } from '../pages/dashboard-page';
import { HelpPage } from '../pages/help-page';
import { LoginPage } from '../pages/login-page';
import { NotFoundPage } from '../pages/not-found-page';
import { ProfilePage } from '../pages/profile-page';
import { SettingsPage } from '../pages/settings-page';
import { StatementsPage } from '../pages/statements-page';
import { TransactionsPage } from '../pages/transactions-page';
import { TransferPage } from '../pages/transfer-page';
import { TransferReviewPage } from '../pages/transfer-review-page';
import { createLogger, type Logger } from '../utils/logger';
import { StepLogger } from '../utils/test-step';

type FrameworkFixtures = {
  appConfig: RuntimeConfig;
  logger: Logger;
  stepLogger: StepLogger;
  dataFactory: DataFactory;
  appShellPage: AppShellPage;
  automationGuideWidget: AutomationGuideWidget;
  loginPage: LoginPage;
  notFoundPage: NotFoundPage;
  dashboardPage: DashboardPage;
  helpPage: HelpPage;
  transferPage: TransferPage;
  transferReviewPage: TransferReviewPage;
  cardsPage: CardsPage;
  profilePage: ProfilePage;
  settingsPage: SettingsPage;
  transactionsPage: TransactionsPage;
  statementsPage: StatementsPage;
};

export const test = base.extend<FrameworkFixtures>({
  appConfig: async ({}, use) => {
    await use(loadRuntimeConfig());
  },
  logger: async ({}, use, testInfo) => {
    const logger = createLogger({
      test: testInfo.titlePath.join(' > ')
    });
    await use(logger);
  },
  stepLogger: async ({ logger }, use) => {
    await use(new StepLogger(logger.child({ scope: 'steps' })));
  },
  dataFactory: async ({ appConfig }, use) => {
    await use(new DataFactory(appConfig.testRunId));
  },
  appShellPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new AppShellPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'AppShellPage' })
      )
    );
  },
  automationGuideWidget: async ({ page, logger }, use) => {
    await use(
      new AutomationGuideWidget(
        page,
        logger.child({ pageObject: 'AutomationGuideWidget' })
      )
    );
  },
  loginPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new LoginPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'LoginPage' })
      )
    );
  },
  helpPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new HelpPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'HelpPage' })
      )
    );
  },
  notFoundPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new NotFoundPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'NotFoundPage' })
      )
    );
  },
  transferPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new TransferPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'TransferPage' })
      )
    );
  },
  transferReviewPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new TransferReviewPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'TransferReviewPage' })
      )
    );
  },
  cardsPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new CardsPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'CardsPage' })
      )
    );
  },
  profilePage: async ({ page, appConfig, logger }, use) => {
    await use(
      new ProfilePage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'ProfilePage' })
      )
    );
  },
  settingsPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new SettingsPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'SettingsPage' })
      )
    );
  },
  transactionsPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new TransactionsPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'TransactionsPage' })
      )
    );
  },
  statementsPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new StatementsPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'StatementsPage' })
      )
    );
  },
  dashboardPage: async ({ page, appConfig, logger }, use) => {
    await use(
      new DashboardPage(
        page,
        appConfig.uiBaseUrl,
        logger.child({ pageObject: 'DashboardPage' })
      )
    );
  }
});

export { expect } from '@playwright/test';

// Base page with shared helpers that concrete page objects can build on.
import type { Page } from '@playwright/test';

import type { Logger } from '../utils/logger';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    private readonly baseUrl: string,
    protected readonly logger: Logger
  ) {}

  protected buildUrl(pathname: string): string {
    return new URL(pathname, this.baseUrl).toString();
  }
}

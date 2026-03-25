export const AUTOMATION_GUIDE_FRAMEWORKS = [
  {
    id: "playwright",
    label: "Playwright",
    shortLabel: "pw",
  },
  {
    id: "cypress",
    label: "Cypress",
    shortLabel: "cy",
  },
  {
    id: "webdriverio",
    label: "WebdriverIO",
    shortLabel: "wdio",
  },
];

export const AUTOMATION_GUIDE_TOPICS = [
  {
    id: "shadow-dom-feedback",
    label: "automate shadow dom",
    title: "Automate Open Shadow DOM",
    locationLabel: "Help > Feedback",
    route: "/help/feedback",
    instruction:
      "Automate the feedback form because it is rendered inside an open shadow root and the host page also mirrors the submission summary outside the component.",
    tip:
      "Open DevTools, inspect the custom element, confirm the shadow root is open, and then look up your framework documentation for shadow DOM interaction.",
    frameworkHints: {
      playwright:
        "Tip: Playwright can pierce open shadow roots with locators, so you can start from the host and target the inner field directly.",
      cypress:
        "Tip: Cypress usually needs .shadow() before you continue the chain into the rendered fields.",
      webdriverio:
        "Tip: WebdriverIO can use shadow$ or shadow$$ from the host element to reach the inner controls.",
    },
    sampleCode: {
      playwright:
        "await page.locator('blu-feedback-widget').locator('[data-testid=\"feedback-summary\"]').fill('Your note here');",
      cypress:
        "cy.get('blu-feedback-widget').shadow().find('[data-testid=\"feedback-summary\"]').type('Your note here')",
      webdriverio:
        "const widget = await $('blu-feedback-widget');\nawait (await widget.shadow$('[data-testid=\"feedback-summary\"]')).setValue('Your note here');",
    },
  },
  {
    id: "iframe-contact",
    label: "automate iframe",
    title: "Automate An Iframe Workflow",
    locationLabel: "Help > Contact Us",
    route: "/help/contact-us",
    instruction:
      "Automate the embedded support form because it runs inside a same-origin iframe and then posts the result back to the host page summary.",
    tip:
      "Inspect the iframe element, switch your automation context into that frame, submit the form there, and then assert the reflected result on the parent page.",
    frameworkHints: {
      playwright:
        "Tip: Use frameLocator for the embedded support console and regular page locators for the host summary after submit.",
      cypress:
        "Tip: Use your team's iframe helper or access the iframe body through contentDocument before targeting the form fields.",
      webdriverio:
        "Tip: Switch into the iframe before interacting with the form, then switch back to the parent context for host-level assertions.",
    },
    sampleCode: {
      playwright:
        "const frame = page.frameLocator('[data-testid=\"help-contact-frame\"]');\nawait frame.getByTestId('contact-submit').click();",
      cypress:
        "cy.get('[data-testid=\"help-contact-frame\"]').its('0.contentDocument.body').should('not.be.empty')",
      webdriverio:
        "const frame = await $('[data-testid=\"help-contact-frame\"]');\nawait browser.switchToFrame(frame);",
    },
  },
  {
    id: "retry-environment-status",
    label: "automate retries",
    title: "Automate Intermittent Load Failures",
    locationLabel: "Help > Environment Status",
    route: "/help/environment-status",
    instruction:
      "Automate the noisy environment page because it deliberately fails on the first two attempts and only loads the content on the third try.",
    tip:
      "Assert the error state, trigger retry through the visible button, and wait for the success content instead of assuming the first load works.",
    frameworkHints: {
      playwright:
        "Tip: Re-query the error and success states between retries so the test follows the actual page transitions.",
      cypress:
        "Tip: Chain assertions around the error card and retry button, then switch the assertion target to the loaded content on the final attempt.",
      webdriverio:
        "Tip: Wait for the error block, click retry, and then wait for the success container to exist before reading its text.",
    },
    sampleCode: {
      playwright:
        "await page.getByTestId('help-environment-status-retry').click();\nawait page.getByTestId('help-environment-status-content').waitFor();",
      cypress:
        "cy.get('[data-testid=\"help-environment-status-retry\"]').click();\ncy.get('[data-testid=\"help-environment-status-content\"]').should('be.visible')",
      webdriverio:
        "await $('[data-testid=\"help-environment-status-retry\"]').click();\nawait $('[data-testid=\"help-environment-status-content\"]').waitForDisplayed();",
    },
  },
  {
    id: "downloads-statements",
    label: "automate downloads",
    title: "Automate Statement Downloads",
    locationLabel: "Statements",
    route: "/statements",
    instruction:
      "Automate the statement export flow and assert that CSV and PDF downloads are triggered with the expected file type.",
    tip:
      "Use your framework's download API rather than checking only for a toast or a button state.",
    frameworkHints: {
      playwright:
        "Tip: Wrap the export click in a download wait and inspect the suggested filename or saved file path.",
      cypress:
        "Tip: Prefer a download task or plugin and assert the file reaches disk rather than relying on browser UI.",
      webdriverio:
        "Tip: Configure the browser download directory up front and validate the created file after the export action.",
    },
    sampleCode: {
      playwright:
        "const download = await page.waitForEvent('download');\nawait page.getByTestId('statement-export-pdf').click();",
      cypress:
        "cy.get('[data-testid=\"statement-export-pdf\"]').click()",
      webdriverio:
        "await $('[data-testid=\"statement-export-pdf\"]').click();",
    },
  },
  {
    id: "scheduled-transfers",
    label: "automate scheduled transfers",
    title: "Automate Pending Transfer Flows",
    locationLabel: "Transfer Money",
    route: "/transfers",
    instruction:
      "Automate a future-dated transfer and verify it stays pending in the review flow and transaction history instead of settling immediately.",
    tip:
      "Assert both the transfer confirmation details and the downstream transaction status so the scenario covers more than form submission.",
    frameworkHints: {
      playwright:
        "Tip: Use role or test ID locators for the review summary, then validate the pending row in transactions after completion.",
      cypress:
        "Tip: Capture the transfer reference and reuse it when filtering the activity list for the pending payment.",
      webdriverio:
        "Tip: Read the confirmation details after submit and then search for the matching pending transaction entry.",
    },
    sampleCode: {
      playwright:
        "await page.getByTestId('transfer-date-type-future').check();\nawait page.getByTestId('transfer-review-submit').click();",
      cypress:
        "cy.get('[data-testid=\"transfer-date-type-future\"]').check()",
      webdriverio:
        "await $('[data-testid=\"transfer-date-type-future\"]').click();",
    },
  },
  {
    id: "card-persistence",
    label: "automate persistence",
    title: "Automate Persistent Card Controls",
    locationLabel: "Cards",
    route: "/cards",
    instruction:
      "Automate a card control change, reload the page, and verify the toggle state persists for the signed-in customer.",
    tip:
      "Reload after the save action so you validate real state persistence instead of only an optimistic UI update.",
    frameworkHints: {
      playwright:
        "Tip: Toggle the control, reload, and then re-read the card row state from fresh locators.",
      cypress:
        "Tip: After the change, reload the route and assert the stored control state from the rendered card controls.",
      webdriverio:
        "Tip: Refresh the page after the update and wait for the card settings panel to rebuild before asserting state.",
    },
    sampleCode: {
      playwright:
        "await page.reload();\nawait expect(page.getByTestId('card-toggle-online-payments')).toBeChecked();",
      cypress:
        "cy.reload();\ncy.get('[data-testid=\"card-toggle-online-payments\"]').should('be.checked')",
      webdriverio:
        "await browser.refresh();\nawait expect($('[data-testid=\"card-toggle-online-payments\"]')).toBeSelected();",
    },
  },
  {
    id: "profile-validation",
    label: "automate validation",
    title: "Automate Form Validation And Save",
    locationLabel: "Profile",
    route: "/profile",
    instruction:
      "Automate invalid profile input first, then fix it and confirm the successful save state after the error messages clear.",
    tip:
      "Validation scenarios are stronger when you assert both the failing state and the recovery path in one test.",
    frameworkHints: {
      playwright:
        "Tip: Use locator visibility checks for the error text and then confirm the success toast after valid input.",
      cypress:
        "Tip: Trigger blur or submit events to surface validation, then replace the value and assert the save response.",
      webdriverio:
        "Tip: Submit the invalid form, inspect the visible error, and then send valid input before asserting the success state.",
    },
    sampleCode: {
      playwright:
        "await page.getByTestId('profile-save').click();\nawait expect(page.getByText('Enter a valid email address.')).toBeVisible();",
      cypress:
        "cy.get('[data-testid=\"profile-save\"]').click()",
      webdriverio:
        "await $('[data-testid=\"profile-save\"]').click();",
    },
  },
  {
    id: "route-guards",
    label: "automate route guards",
    title: "Automate Protected Route Redirects",
    locationLabel: "Account Summary",
    route: "/dashboard",
    instruction:
      "Automate a protected-route check by visiting a signed-in page without a session and verifying the app redirects to login.",
    tip:
      "Use direct navigation to the protected URL instead of clicking through the UI so the guard itself is what the test exercises.",
    frameworkHints: {
      playwright:
        "Tip: Navigate straight to the protected path and assert the final URL and login form visibility.",
      cypress:
        "Tip: Visit the protected route directly and wait on the redirected login page rather than the original destination.",
      webdriverio:
        "Tip: Open the protected page URL and assert the browser lands on login with the sign-in form displayed.",
    },
    sampleCode: {
      playwright:
        "await page.goto('/dashboard');\nawait expect(page).toHaveURL(/\\/login$/);",
      cypress:
        "cy.visit('/dashboard');\ncy.url().should('match', /\\/login$/)",
      webdriverio:
        "await browser.url('/dashboard');\nawait expect(browser).toHaveUrl(expect.stringMatching(/\\/login$/));",
    },
  },
  {
    id: "loading-overlays",
    label: "automate loading overlays",
    title: "Automate Variable Loading Overlays",
    locationLabel: "Transfer Money",
    route: "/transfers",
    instruction:
      "Use the performance settings to introduce variable delays, then automate a route transition that waits for the loading overlay to disappear before continuing.",
    tip:
      "Wait on the overlay lifecycle, not on a fixed timeout. This is exactly the type of flakiness trap this training app is meant to surface.",
    frameworkHints: {
      playwright:
        "Tip: Wait for the overlay to become visible and then hidden before interacting with the destination page.",
      cypress:
        "Tip: Assert the overlay exists, then wait for it to no longer be present before continuing the test.",
      webdriverio:
        "Tip: Wait for the loading overlay to display and then wait for it to disappear before targeting the page controls.",
    },
    sampleCode: {
      playwright:
        "await page.getByTestId('app-loading-overlay').waitFor({ state: 'visible' });\nawait page.getByTestId('app-loading-overlay').waitFor({ state: 'hidden' });",
      cypress:
        "cy.get('[data-testid=\"app-loading-overlay\"]').should('be.visible');\ncy.get('[data-testid=\"app-loading-overlay\"]').should('not.exist')",
      webdriverio:
        "await $('[data-testid=\"app-loading-overlay\"]').waitForDisplayed();\nawait $('[data-testid=\"app-loading-overlay\"]').waitForDisplayed({ reverse: true });",
    },
  },
];

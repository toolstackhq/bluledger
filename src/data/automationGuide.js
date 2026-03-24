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
    location: "Login, then navigate to Help > Feedback.",
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
    location: "Login, then navigate to Help > Contact Us.",
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
];

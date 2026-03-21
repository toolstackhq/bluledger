import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../src/App";
import testUsers from "../src/data/testUsers.json";

const primaryUser = testUsers[0];
const depositOnlyUser = testUsers.find((user) => user.customerId === "61844027");

function checkInteractiveIds(container) {
  const interactiveElements = [
    ...container.querySelectorAll("a, button, input:not([type='hidden']), select, textarea"),
  ];

  const missingIds = interactiveElements
    .filter((element) => !element.id || !element.id.trim())
    .map((element) => element.outerHTML.slice(0, 160));

  const ids = interactiveElements.map((element) => element.id).filter(Boolean);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  expect(missingIds).toEqual([]);
  expect(duplicateIds).toEqual([]);
}

async function runAxe(target) {
  expect(await axe(target)).toHaveNoViolations();
}

function renderAt(path = "/login") {
  window.history.pushState({}, "", path);
  return render(<App />);
}

async function login(user = primaryUser) {
  const customerIdField = await screen.findByLabelText(/^Customer ID$/i);
  const passwordField = screen.getByLabelText(/^Password$/i);

  await userEvent.type(customerIdField, user.customerId);
  await userEvent.type(passwordField, user.password);
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

  await screen.findByRole("heading", { name: /account summary/i });
}

async function goToPage(linkId, headingName) {
  await userEvent.click(document.getElementById(linkId));
  await screen.findByRole("heading", { level: 1, name: headingName });
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("accessibility", () => {
  it("keeps the login page and test user dialog accessible", async () => {
    const { container } = renderAt("/login");

    await screen.findByLabelText(/^Customer ID$/i);
    checkInteractiveIds(container);
    await runAxe(container);

    await userEvent.click(screen.getByRole("button", { name: /view test users/i }));

    const dialog = await screen.findByRole("dialog", { name: /test users/i });
    checkInteractiveIds(container);
    await runAxe(dialog);
  });

  it("keeps the primary authenticated pages accessible", async () => {
    const { container } = renderAt("/login");

    await login(primaryUser);
    checkInteractiveIds(container);
    await runAxe(container);

    await goToPage("side-nav-transfers", /^Transfer Money$/i);
    checkInteractiveIds(container);
    await runAxe(container);

    await goToPage("side-nav-transactions", /^Transactions$/i);
    checkInteractiveIds(container);
    await runAxe(container);

    await goToPage("side-nav-statements", /^Statements$/i);
    checkInteractiveIds(container);
    await runAxe(container);

    await goToPage("side-nav-cards", /^Cards$/i);
    checkInteractiveIds(container);
    await runAxe(container);

    await goToPage("side-nav-profile", /^My Details$/i);
    checkInteractiveIds(container);
    await runAxe(container);

    await goToPage("side-nav-settings", /^Settings$/i);
    checkInteractiveIds(container);
    await runAxe(container);
  });

  it("keeps the transfer review flow and success modal accessible", async () => {
    const { container } = renderAt("/login");

    await login(primaryUser);
    await userEvent.click(document.getElementById("side-nav-transfers"));
    await screen.findByRole("heading", { level: 1, name: /^Transfer Money$/i });

    await userEvent.selectOptions(screen.getByLabelText(/destination type/i), "own");
    await userEvent.selectOptions(screen.getByLabelText(/destination account/i), "acct-saver");
    await userEvent.clear(screen.getByLabelText(/amount/i));
    await userEvent.type(screen.getByLabelText(/amount/i), "25");
    await userEvent.type(screen.getByLabelText(/reference/i), "A11Y TEST");
    await userEvent.click(document.getElementById("transfer-continue-button"));

    await screen.findByRole("heading", { level: 1, name: /^Transfer Review$/i });
    checkInteractiveIds(container);
    await runAxe(container);

    await userEvent.click(document.getElementById("transfer-confirm-button"));

    const dialog = await screen.findByRole("dialog", { name: /transfer successful/i });
    checkInteractiveIds(container);
    await runAxe(dialog);
  });

  it("keeps the empty cards state accessible for a user without cards", async () => {
    const { container } = renderAt("/login");

    await login(depositOnlyUser);
    await userEvent.click(document.getElementById("side-nav-cards"));
    await screen.findByRole("heading", { level: 1, name: /^Cards$/i });

    await waitFor(() => {
      expect(screen.getByText(/no active cards/i)).toBeInTheDocument();
    });

    checkInteractiveIds(container);
    await runAxe(container);
  });

  it("shows prefill options with usable credentials", async () => {
    renderAt("/login");

    await userEvent.click(screen.getByRole("button", { name: /view test users/i }));

    const dialog = await screen.findByRole("dialog", { name: /test users/i });
    const firstUserButton = within(dialog).getByRole("button", {
      name: new RegExp(primaryUser.customerId),
    });

    await userEvent.click(firstUserButton);

    expect(screen.getByLabelText(/^Customer ID$/i)).toHaveValue(primaryUser.customerId);
    expect(screen.getByLabelText(/^Password$/i)).toHaveValue(primaryUser.password);
  });
});

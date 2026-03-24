export const APP_NAV_ITEMS = [
  { label: "Accounts", to: "/dashboard" },
  { label: "Payments", to: "/transfers" },
  { label: "Transactions", to: "/transactions" },
  { label: "Statements", to: "/statements" },
  { label: "Cards", to: "/cards" },
  { label: "Profile", to: "/profile" },
  { label: "Settings", to: "/settings" },
];

export const HELP_NAV_ENTRY = {
  label: "Help",
  to: "/help/contact-us",
};

export function getAppNavItems(helpCenterEnabled) {
  return helpCenterEnabled ? [...APP_NAV_ITEMS, HELP_NAV_ENTRY] : APP_NAV_ITEMS;
}

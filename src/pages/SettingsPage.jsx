import { useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SectionPanel from "../components/SectionPanel";
import SummaryStrip from "../components/SummaryStrip";
import UtilityPanel from "../components/UtilityPanel";
import InfoBanner from "../components/InfoBanner";
import { useAppContext } from "../context/AppContext";

function SettingsPage() {
  const { settings, preferences, saveSettings, utilityPanel } = useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  function updateSettingsSection(section, field, value) {
    setLocalSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  function updatePreference(field, value) {
    setLocalPreferences((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleReset() {
    setLocalSettings(settings);
    setLocalPreferences(preferences);
  }

  function handleSave() {
    saveSettings(localSettings, localPreferences);
  }

  const summaryItems = [
    {
      label: "Security alerts",
      value: localSettings.security.smsAlerts ? "SMS on" : "SMS off",
      note: localSettings.security.emailNotifications ? "Email alerts enabled" : "Email alerts off",
    },
    {
      label: "Contact preference",
      value: localPreferences.preferredContactMethod,
      note: "Used for servicing communications",
    },
    {
      label: "Statement delivery",
      value: localSettings.statements.deliveryMethod,
      note: localSettings.statements.paperStatements ? "Paper copies also requested" : "Digital only",
    },
    {
      label: "Session timeout",
      value: `${localPreferences.sessionTimeoutMinutes} min`,
      note: "Applies after inactivity",
    },
  ];

  return (
    <AppShell railContent={<UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}>
      <div className="page-stack">
        <PageHeader
          eyebrow="Preferences"
          title="Settings"
          subtitle="Review security, notifications, statements and accessibility preferences."
          actions={
            <>
              <button
                id="settings-reset-button"
                type="button"
                className="button-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                id="settings-save-button"
                type="button"
                className="button-primary"
                onClick={handleSave}
                data-testid="settings-save"
              >
                Save settings
              </button>
            </>
          }
        />
        <SummaryStrip items={summaryItems} />
        <InfoBanner
          title="Two-step verification"
          message={localSettings.security.twoStepInfo}
          tone="info"
        />

        <SectionPanel
          title="Security preferences"
          subtitle="Manage how BluLedger contacts you about sign-in and account activity"
        >
          <div className="form-grid">
            <label className="toggle-row" htmlFor="settings-sms-alerts">
              <input
                id="settings-sms-alerts"
                type="checkbox"
                checked={localSettings.security.smsAlerts}
                onChange={(event) =>
                  updateSettingsSection("security", "smsAlerts", event.target.checked)
                }
              />
              <span>SMS alerts</span>
            </label>
            <label className="toggle-row" htmlFor="settings-email-notifications">
              <input
                id="settings-email-notifications"
                type="checkbox"
                checked={localSettings.security.emailNotifications}
                onChange={(event) =>
                  updateSettingsSection(
                    "security",
                    "emailNotifications",
                    event.target.checked
                  )
                }
              />
              <span>Email notifications</span>
            </label>
            <div className="form-hint">
              Trusted devices registered: {localSettings.security.trustedDevices}
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Notifications"
          subtitle="Choose which servicing and balance notifications you receive"
        >
          <div className="form-grid">
            <label className="toggle-row" htmlFor="settings-payment-reminders">
              <input
                id="settings-payment-reminders"
                type="checkbox"
                checked={localSettings.notifications.paymentReminders}
                onChange={(event) =>
                  updateSettingsSection(
                    "notifications",
                    "paymentReminders",
                    event.target.checked
                  )
                }
              />
              <span>Payment reminders</span>
            </label>
            <label className="toggle-row" htmlFor="settings-low-balance-alerts">
              <input
                id="settings-low-balance-alerts"
                type="checkbox"
                checked={localSettings.notifications.lowBalanceAlerts}
                onChange={(event) =>
                  updateSettingsSection(
                    "notifications",
                    "lowBalanceAlerts",
                    event.target.checked
                  )
                }
              />
              <span>Low balance alerts</span>
            </label>
            <label className="toggle-row" htmlFor="settings-card-alerts">
              <input
                id="settings-card-alerts"
                type="checkbox"
                checked={localSettings.notifications.cardAlerts}
                onChange={(event) =>
                  updateSettingsSection("notifications", "cardAlerts", event.target.checked)
                }
              />
              <span>Card usage alerts</span>
            </label>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Statements and preferences"
          subtitle="Control document delivery, timeout behaviour and communication settings"
        >
          <div className="split-panels">
            <div className="form-grid">
              <label className="toggle-row" htmlFor="settings-paper-statements">
                <input
                  id="settings-paper-statements"
                  type="checkbox"
                  checked={localSettings.statements.paperStatements}
                  onChange={(event) =>
                    updateSettingsSection(
                      "statements",
                      "paperStatements",
                      event.target.checked
                    )
                  }
                />
                <span>Paper statements</span>
              </label>
              <div className="form-row">
                <label htmlFor="statementDelivery">Statement delivery</label>
                <select
                  id="statementDelivery"
                  value={localSettings.statements.deliveryMethod}
                  onChange={(event) =>
                    updateSettingsSection(
                      "statements",
                      "deliveryMethod",
                      event.target.value
                    )
                  }
                >
                  <option value="eStatement">eStatement</option>
                  <option value="Secure mail">Secure mail</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="sessionTimeout">Session timeout</label>
                <select
                  id="sessionTimeout"
                  value={localPreferences.sessionTimeoutMinutes}
                  onChange={(event) =>
                    updatePreference("sessionTimeoutMinutes", Number(event.target.value))
                  }
                >
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-row">
                <label htmlFor="preferredContact">Preferred contact</label>
                <select
                  id="preferredContact"
                  value={localPreferences.preferredContactMethod}
                  onChange={(event) =>
                    updatePreference("preferredContactMethod", event.target.value)
                  }
                >
                  <option value="Email">Email</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Mail">Mail</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="appearance">Appearance</label>
                <select
                  id="appearance"
                  value={localPreferences.appearance}
                  onChange={(event) => updatePreference("appearance", event.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="High contrast">High contrast</option>
                </select>
              </div>
              <label className="toggle-row" htmlFor="settings-marketing-opt-in">
                <input
                  id="settings-marketing-opt-in"
                  type="checkbox"
                  checked={localPreferences.marketingOptIn}
                  onChange={(event) =>
                    updatePreference("marketingOptIn", event.target.checked)
                  }
                />
                <span>Marketing communications</span>
              </label>
              <label className="toggle-row" htmlFor="settings-dark-mode">
                <input
                  id="settings-dark-mode"
                  type="checkbox"
                  checked={localPreferences.darkMode}
                  onChange={(event) => updatePreference("darkMode", event.target.checked)}
                />
                <span>Dark mode preview</span>
              </label>
            </div>
          </div>
        </SectionPanel>

      </div>
    </AppShell>
  );
}

export default SettingsPage;

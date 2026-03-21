import SectionPanel from "./SectionPanel";
import InfoBanner from "./InfoBanner";

function AlertsPanel({ alerts }) {
  return (
    <SectionPanel title="Alerts and Reminders">
      <div className="alert-list">
        {alerts.map((alert) => (
          <InfoBanner
            key={alert.id}
            title={alert.title}
            message={alert.message}
            tone={alert.tone}
          />
        ))}
      </div>
    </SectionPanel>
  );
}

export default AlertsPanel;

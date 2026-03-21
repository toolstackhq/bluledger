function StatusPill({ status }) {
  const normalised = String(status).toLowerCase().replace(/\s+/g, "-");
  const variant = normalised === "available" ? "active" : normalised;

  return <span className={`status-pill status-pill--${variant}`}>{status}</span>;
}

export default StatusPill;

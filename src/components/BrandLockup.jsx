function BrandLockup({ inverted = false, large = false, subtitle }) {
  const className = [
    "brand-lockup",
    inverted ? "brand-lockup--inverted" : "",
    large ? "brand-lockup--large" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <span className="brand-lockup__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" focusable="false">
          <rect x="6" y="6" width="52" height="52" rx="12" />
          <path d="M22 18h8v28h-8zM34 18h8v18h-8zM18 40h28v6H18z" />
          <circle cx="45.5" cy="23.5" r="4.5" />
        </svg>
      </span>
      <span className="brand-lockup__text">
        <span className="brand-lockup__name">
          <span className="brand-lockup__name-primary">Blu</span>
          <span className="brand-lockup__name-secondary">Ledger</span>
        </span>
        {subtitle ? <span className="brand-lockup__subtitle">{subtitle}</span> : null}
      </span>
    </div>
  );
}

export default BrandLockup;

function InfoBanner({ title, message, tone = "info" }) {
  return (
    <div className={`info-banner info-banner--${tone}`}>
      <div className="info-banner__title">{title}</div>
      <div className="info-banner__message">{message}</div>
    </div>
  );
}

export default InfoBanner;

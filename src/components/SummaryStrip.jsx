function SummaryStrip({ items }) {
  return (
    <div className="summary-strip">
      {items.map((item) => (
        <div key={item.label} className="summary-strip__item">
          <span className="summary-strip__label">{item.label}</span>
          <div className="summary-strip__value">{item.value}</div>
          {item.note ? <div className="summary-strip__note">{item.note}</div> : null}
        </div>
      ))}
    </div>
  );
}

export default SummaryStrip;

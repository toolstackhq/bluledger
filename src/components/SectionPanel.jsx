function SectionPanel({ title, action, children, testId }) {
  return (
    <section className="panel" data-testid={testId}>
      {title ? (
        <div className="panel__header">
          <h2>{title}</h2>
          {action}
        </div>
      ) : null}
      <div className="panel__body">{children}</div>
    </section>
  );
}

export default SectionPanel;

function SectionPanel({ title, subtitle, action, children, testId }) {
  return (
    <section className="panel" data-testid={testId}>
      {title ? (
        <div className="panel__header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p className="panel__subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div role="group" aria-label={`${title} section actions`}>{action}</div> : null}
        </div>
      ) : null}
      <div className="panel__body">{children}</div>
    </section>
  );
}

export default SectionPanel;

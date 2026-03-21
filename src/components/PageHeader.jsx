function PageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow ? <div className="page-header__eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="section-actions" role="group" aria-label={`${title} actions`}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default PageHeader;

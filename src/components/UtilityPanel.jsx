import SectionPanel from "./SectionPanel";

function UtilityPanel({ title, items }) {
  return (
    <SectionPanel title={title}>
      <ul className="utility-list">
        {items.map((item) => (
          <li key={item.id}>
            <span className="utility-label">{item.label}</span>
            <div>{item.value}</div>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}

export default UtilityPanel;

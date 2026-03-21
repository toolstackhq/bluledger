import { formatCurrency } from "../utils/currency";
import { formatDateTime, formatDisplayDate } from "../utils/date";
import SectionPanel from "./SectionPanel";

function ReviewPanel({ details }) {
  return (
    <SectionPanel title="Transfer Review" testId="transfer-review-panel">
      <dl className="review-grid">
        <dt>From account</dt>
        <dd>{details.fromLabel}</dd>
        <dt>Destination</dt>
        <dd>{details.destinationLabel}</dd>
        <dt>Amount</dt>
        <dd>{formatCurrency(details.amount)}</dd>
        <dt>Reference</dt>
        <dd>{details.reference}</dd>
        <dt>Note</dt>
        <dd>{details.note || "No additional note provided"}</dd>
        <dt>Transfer date</dt>
        <dd>{formatDisplayDate(details.scheduledDate)}</dd>
        <dt>Processing note</dt>
        <dd>{details.processingNote}</dd>
        {details.reviewedAt ? (
          <>
            <dt>Reviewed</dt>
            <dd>{formatDateTime(details.reviewedAt)}</dd>
          </>
        ) : null}
      </dl>
    </SectionPanel>
  );
}

export default ReviewPanel;

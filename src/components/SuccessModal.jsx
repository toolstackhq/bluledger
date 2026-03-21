import { formatCurrency } from "../utils/currency";
import { formatDateTime, formatDisplayDate } from "../utils/date";

function SuccessModal({ details, onBackToDashboard, onMakeAnotherTransfer }) {
  if (!details) {
    return null;
  }

  return (
    <div className="modal-overlay" data-testid="transfer-success-modal">
      <div className="modal-card">
        <div className="modal-card__header">
          <h2>Transfer successful</h2>
        </div>
        <div className="modal-card__body">
          <p>Your payment instruction has been recorded.</p>
          <dl className="review-grid">
            <dt>Receipt number</dt>
            <dd data-testid="transfer-success-receipt">{details.receiptNumber}</dd>
            <dt>Amount</dt>
            <dd>{formatCurrency(details.amount)}</dd>
            <dt>From account</dt>
            <dd>{details.sourceLabel}</dd>
            <dt>Destination</dt>
            <dd>{details.destinationLabel}</dd>
            <dt>Reference</dt>
            <dd>{details.reference}</dd>
            <dt>Transfer date</dt>
            <dd>{formatDisplayDate(details.scheduledDate)}</dd>
            <dt>Status</dt>
            <dd>{details.status}</dd>
            <dt>Timestamp</dt>
            <dd>{formatDateTime(details.timestamp)}</dd>
          </dl>
        </div>
        <div className="modal-card__footer">
          <div className="button-row">
            <button type="button" className="button-primary" onClick={onBackToDashboard}>
              Back to dashboard
            </button>
            <button type="button" className="button-secondary" onClick={onMakeAnotherTransfer}>
              Make another transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;

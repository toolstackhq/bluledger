import { Navigate, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import ReviewPanel from "../components/ReviewPanel";
import SuccessModal from "../components/SuccessModal";
import UtilityPanel from "../components/UtilityPanel";
import { useAppContext } from "../context/AppContext";
import { formatAccountLabel } from "../utils/formatters";

function TransferReviewPage() {
  const {
    accounts,
    payees,
    transferDraft,
    confirmTransfer,
    transferDefaults,
    utilityPanel,
  } = useAppContext();
  const navigate = useNavigate();
  const [successDetails, setSuccessDetails] = useState(null);

  const reviewDetails = useMemo(() => {
    if (!transferDraft) {
      return null;
    }

    const fromAccount = accounts.find(
      (account) => account.id === transferDraft.fromAccountId
    );
    const ownDestination = accounts.find(
      (account) => account.id === transferDraft.destinationId
    );
    const payeeDestination = payees.find(
      (payee) => payee.id === transferDraft.destinationId
    );

    return {
      fromLabel: formatAccountLabel(fromAccount),
      destinationLabel:
        transferDraft.destinationType === "own"
          ? formatAccountLabel(ownDestination)
          : `${payeeDestination.nickname} • ${payeeDestination.name}`,
      amount: transferDraft.amount,
      reference: transferDraft.reference,
      note: transferDraft.note,
      scheduledDate: transferDraft.scheduledDate,
      processingNote:
        transferDraft.transferDateType === "future"
          ? "This payment will remain pending until the scheduled date."
          : transferDefaults.processingCutoff,
      reviewedAt: new Date().toISOString(),
    };
  }, [accounts, payees, transferDraft, transferDefaults.processingCutoff]);

  const currentReviewDetails = successDetails?.reviewDetails || reviewDetails;

  if (!transferDraft && !successDetails) {
    return <Navigate to="/transfers" replace />;
  }

  function handleConfirm() {
    const result = confirmTransfer();

    if (result) {
      setSuccessDetails({
        ...result,
        reviewDetails,
      });
    }
  }

  return (
    <AppShell railContent={<UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}>
      <div className="page-stack">
        <PageHeader
          title="Transfer Review"
          subtitle="Confirm the payment details before submitting."
        />

        <ReviewPanel details={currentReviewDetails} />

        <div className="button-row">
          <button type="button" className="button-secondary" onClick={() => navigate("/transfers")}>
            Back
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={handleConfirm}
            data-testid="transfer-confirm"
          >
            Confirm transfer
          </button>
        </div>
      </div>

      <SuccessModal
        details={successDetails}
        onBackToDashboard={() => navigate("/dashboard")}
        onMakeAnotherTransfer={() => navigate("/transfers")}
      />
    </AppShell>
  );
}

export default TransferReviewPage;

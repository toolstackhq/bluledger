import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SectionPanel from "../components/SectionPanel";
import TransferForm from "../components/TransferForm";
import UtilityPanel from "../components/UtilityPanel";
import InfoBanner from "../components/InfoBanner";
import { useAppContext } from "../context/AppContext";

function TransferPage() {
  const {
    accounts,
    payees,
    transferDefaults,
    transferDraft,
    saveTransferDraft,
    utilityPanel,
  } = useAppContext();
  const navigate = useNavigate();

  function handleSubmit(draft) {
    saveTransferDraft(draft);
    navigate("/transfers/review");
  }

  return (
    <AppShell
      railContent={
        <>
          <InfoBanner
            title="Payment processing"
            message={transferDefaults.processingCutoff}
            tone="info"
          />
          <UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />
        </>
      }
    >
      <div className="page-stack">
        <PageHeader
          title="Transfer Money"
          subtitle="Create a transfer between your accounts or a saved payee."
        />
        <SectionPanel title="Payment details">
          <TransferForm
            accounts={accounts}
            payees={payees}
            transferDefaults={transferDefaults}
            initialDraft={transferDraft}
            onSubmit={handleSubmit}
          />
        </SectionPanel>
      </div>
    </AppShell>
  );
}

export default TransferPage;

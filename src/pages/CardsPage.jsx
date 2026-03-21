import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SectionPanel from "../components/SectionPanel";
import CardManagementTable from "../components/CardManagementTable";
import AlertsPanel from "../components/AlertsPanel";
import UtilityPanel from "../components/UtilityPanel";
import InfoBanner from "../components/InfoBanner";
import SummaryStrip from "../components/SummaryStrip";
import { useAppContext } from "../context/AppContext";

function CardsPage() {
  const {
    cards,
    accounts,
    alerts,
    cardOptions,
    profile,
    utilityPanel,
    updateCard,
    showToast,
  } = useAppContext();

  function handleToggleLock(card) {
    const nextStatus = card.status === "Locked" ? "Active" : "Locked";
    updateCard(card.id, { status: nextStatus }, `Card ${nextStatus.toLowerCase()}.`);
  }

  function handleReplace(cardId) {
    updateCard(
      cardId,
      { replacementInProgress: true, status: "Active" },
      "Replacement card request recorded."
    );
  }

  function handleSaveNickname(cardId, nickname) {
    updateCard(cardId, { nickname }, "Card nickname updated.");
  }

  function handleToggleInternational(cardId, enabled) {
    updateCard(cardId, { internationalEnabled: enabled }, "International usage preference updated.");
  }

  function handleViewLimits(card) {
    showToast(
      `${card.nickname}: ATM ${card.dailyLimit} AUD, online ${card.onlineLimit} AUD.`,
      "info"
    );
  }

  const activeCards = cards.filter((card) => card.status === "Active").length;
  const lockedCards = cards.filter((card) => card.status === "Locked").length;
  const replacementCards = cards.filter((card) => card.replacementInProgress).length;
  const internationalCards = cards.filter((card) => card.internationalEnabled).length;

  const summaryItems = [
    {
      label: "Cards on file",
      value: cards.length,
      note: "Debit and credit cards linked to this profile",
    },
    {
      label: "Active cards",
      value: activeCards,
      note: lockedCards > 0 ? `${lockedCards} currently locked` : "No locked cards",
    },
    {
      label: "International enabled",
      value: internationalCards,
      note: "Cards available for overseas and online use",
    },
    {
      label: "Replacement requests",
      value: replacementCards,
      note: replacementCards > 0 ? "Replacement monitoring required" : "No replacements in progress",
    },
  ];

  return (
    <AppShell
      railContent={
        <>
          <AlertsPanel alerts={alerts} />
          <UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />
        </>
      }
    >
      <div className="page-stack">
        <PageHeader
          title="Cards"
          subtitle="Review card status, usage controls and replacement actions."
        />
        <SummaryStrip items={summaryItems} />
        <InfoBanner
          title="International usage"
          message={cardOptions.internationalNotice}
          tone="info"
        />
        <SectionPanel title="Card management">
          <CardManagementTable
            cards={cards}
            accounts={accounts}
            cardOptions={cardOptions}
            cardholderName={profile.fullName}
            onToggleLock={handleToggleLock}
            onReplace={handleReplace}
            onSaveNickname={handleSaveNickname}
            onToggleInternational={handleToggleInternational}
            onViewLimits={handleViewLimits}
          />
        </SectionPanel>
      </div>
    </AppShell>
  );
}

export default CardsPage;

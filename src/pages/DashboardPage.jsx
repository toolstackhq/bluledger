import { useMemo } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SummaryStrip from "../components/SummaryStrip";
import SectionPanel from "../components/SectionPanel";
import AccountSummaryTable from "../components/AccountSummaryTable";
import RecentTransactionsTable from "../components/RecentTransactionsTable";
import QuickLinksPanel from "../components/QuickLinksPanel";
import AlertsPanel from "../components/AlertsPanel";
import UtilityPanel from "../components/UtilityPanel";
import InfoBanner from "../components/InfoBanner";
import { useAppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/currency";

function DashboardPage() {
  const {
    user,
    accounts,
    transactions,
    quickLinks,
    alerts,
    banners,
    utilityPanel,
    dashboardSummary,
  } = useAppContext();

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((left, right) => new Date(right.date) - new Date(left.date))
        .slice(0, 7),
    [transactions]
  );

  const summaryItems = [
    {
      label: "Total balance",
      value: formatCurrency(dashboardSummary.totalBalance),
      note: "Across deposit and offset accounts",
    },
    {
      label: "Available funds",
      value: formatCurrency(dashboardSummary.availableFunds),
      note: "Ready for immediate use",
    },
    {
      label: "Upcoming payments",
      value: dashboardSummary.upcomingPayments,
      note: "Scheduled items in the next 7 days",
    },
    {
      label: "Pending transactions",
      value: dashboardSummary.pendingTransactions,
      note: "Awaiting processing",
    },
  ];

  return (
    <AppShell
      railContent={
        <>
          <QuickLinksPanel links={quickLinks} />
          <AlertsPanel alerts={alerts} />
          <UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />
        </>
      }
    >
      <div className="page-stack">
        <PageHeader
          eyebrow="Digital Banking"
          title="Account Summary"
          subtitle={`Good morning, ${user.preferredName}. Review balances, recent activity and pending items.`}
          actions={
            <>
              <Link className="button-secondary button-inline-link" to="/statements">
                View statements
              </Link>
              <Link className="button-primary button-inline-link" to="/transfers">
                Transfer money
              </Link>
            </>
          }
        />

        {banners.map((banner) => (
          <InfoBanner
            key={banner.id}
            title={banner.title}
            message={banner.message}
            tone={banner.tone}
          />
        ))}

        <SummaryStrip items={summaryItems} />

        <SectionPanel
          title="Accounts"
          subtitle="Balances and availability across your linked products"
        >
          <AccountSummaryTable accounts={accounts} />
        </SectionPanel>

        <SectionPanel
          title="Recent Transactions"
          subtitle="Latest posted and pending account activity"
        >
          {recentTransactions.length > 0 ? (
            <RecentTransactionsTable transactions={recentTransactions} />
          ) : (
            <div className="empty-state">
              <h3>No recent transactions</h3>
              <p>No account activity is available for this customer yet.</p>
            </div>
          )}
        </SectionPanel>
      </div>
    </AppShell>
  );
}

export default DashboardPage;

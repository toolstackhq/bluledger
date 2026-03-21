import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SectionPanel from "../components/SectionPanel";
import SummaryStrip from "../components/SummaryStrip";
import SearchFilterBar from "../components/SearchFilterBar";
import StatusPill from "../components/StatusPill";
import UtilityPanel from "../components/UtilityPanel";
import { useAppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/currency";
import { formatDisplayDate } from "../utils/date";

function TransactionsPage() {
  const { accounts, transactions, utilityPanel } = useAppContext();
  const [filters, setFilters] = useState({
    search: "",
    accountId: "all",
    type: "all",
    status: "all",
  });
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .sort((left, right) => new Date(right.date) - new Date(left.date))
      .filter((transaction) => {
        const matchesSearch =
          filters.search === "" ||
          transaction.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          transaction.reference.toLowerCase().includes(filters.search.toLowerCase());
        const matchesAccount =
          filters.accountId === "all" || transaction.accountId === filters.accountId;
        const matchesType =
          filters.type === "all" || transaction.type === filters.type;
        const matchesStatus =
          filters.status === "all" || transaction.status === filters.status;

        return matchesSearch && matchesAccount && matchesType && matchesStatus;
      });
  }, [filters, transactions]);

  function updateFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
    setVisibleCount(12);
  }

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);
  const pendingCount = filteredTransactions.filter(
    (transaction) => transaction.status === "Pending"
  ).length;
  const debitTotal = filteredTransactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  const creditTotal = filteredTransactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const summaryItems = [
    {
      label: "Results",
      value: filteredTransactions.length,
      note: "Matching the current search and filters",
    },
    {
      label: "Pending items",
      value: pendingCount,
      note: "Awaiting final processing",
    },
    {
      label: "Credits",
      value: formatCurrency(creditTotal),
      note: "Within the current result set",
    },
    {
      label: "Debits",
      value: formatCurrency(debitTotal),
      note: "Within the current result set",
    },
  ];

  return (
    <AppShell railContent={<UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}>
      <div className="page-stack">
        <PageHeader
          eyebrow="Activity"
          title="Transactions"
          subtitle="Search and review account activity across your banking products."
        />
        <SummaryStrip items={summaryItems} />
        <SectionPanel
          title="Transaction Search"
          subtitle="Filter by account, status, type or keyword"
        >
          <SearchFilterBar filters={filters} onChange={updateFilter} accounts={accounts} />
        </SectionPanel>
        <SectionPanel
          title="Transaction History"
          subtitle={`Showing ${visibleTransactions.length} of ${filteredTransactions.length} matching transactions`}
        >
          {visibleTransactions.length > 0 ? (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th className="numeric">Amount</th>
                    <th className="numeric">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{formatDisplayDate(transaction.date)}</td>
                      <td>
                        <div>{transaction.description}</div>
                        <div className="table-subline">{transaction.reference}</div>
                      </td>
                      <td>{transaction.type}</td>
                      <td>
                        <StatusPill status={transaction.status} />
                      </td>
                      <td className="numeric">{formatCurrency(transaction.amount)}</td>
                      <td className="numeric">{formatCurrency(transaction.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length > visibleCount ? (
                <div className="button-row" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => setVisibleCount((count) => count + 12)}
                  >
                    Load more
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="empty-state">
              <h3>No transactions matched your search</h3>
              <p>Try adjusting the selected account, type, status or keyword filters.</p>
            </div>
          )}
        </SectionPanel>
      </div>
    </AppShell>
  );
}

export default TransactionsPage;

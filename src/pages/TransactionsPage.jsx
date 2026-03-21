import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SectionPanel from "../components/SectionPanel";
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

  return (
    <AppShell railContent={<UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}>
      <div className="page-stack">
        <PageHeader
          title="Transactions"
          subtitle="Search and review account activity across your banking products."
        />
        <SectionPanel title="Transaction Search">
          <SearchFilterBar filters={filters} onChange={updateFilter} accounts={accounts} />
        </SectionPanel>
        <SectionPanel title="Transaction History">
          {visibleTransactions.length > 0 ? (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Reference</th>
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
                      <td>{transaction.description}</td>
                      <td>{transaction.reference}</td>
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
            <div>No transactions matched your search.</div>
          )}
        </SectionPanel>
      </div>
    </AppShell>
  );
}

export default TransactionsPage;

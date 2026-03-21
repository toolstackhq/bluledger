import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SectionPanel from "../components/SectionPanel";
import SummaryStrip from "../components/SummaryStrip";
import UtilityPanel from "../components/UtilityPanel";
import InfoBanner from "../components/InfoBanner";
import StatusPill from "../components/StatusPill";
import { useAppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/currency";
import { formatDisplayDate } from "../utils/date";
import {
  downloadStatementCsv,
  downloadStatementPdf,
  formatStatementPeriod,
} from "../utils/statements";

function StatementsPage() {
  const { accounts, statements, transactions, utilityPanel, showToast } = useAppContext();
  const [selectedAccountId, setSelectedAccountId] = useState(statements[0]?.accountId || "");
  const [selectedStatementId, setSelectedStatementId] = useState(statements[0]?.id || "");

  const visibleStatements = useMemo(
    () => statements.filter((statement) => statement.accountId === selectedAccountId),
    [selectedAccountId, statements]
  );

  useEffect(() => {
    if (!visibleStatements.some((statement) => statement.id === selectedStatementId)) {
      setSelectedStatementId(visibleStatements[0]?.id || "");
    }
  }, [selectedStatementId, visibleStatements]);

  const selectedStatement =
    visibleStatements.find((statement) => statement.id === selectedStatementId) ||
    visibleStatements[0];
  const selectedAccount = accounts.find(
    (account) => account.id === selectedStatement?.accountId
  );

  const statementTransactions = useMemo(() => {
    if (!selectedStatement) {
      return [];
    }

    return [...transactions]
      .filter(
        (transaction) =>
          transaction.accountId === selectedStatement.accountId &&
          transaction.date >= selectedStatement.periodStart &&
          transaction.date <= selectedStatement.periodEnd
      )
      .sort((left, right) => new Date(right.date) - new Date(left.date));
  }, [selectedStatement, transactions]);

  const summaryItems = [
    {
      label: "Available statements",
      value: statements.length,
      note: "Exports available in PDF and CSV",
    },
    {
      label: "Current account",
      value: selectedAccount?.productName || "-",
      note: selectedStatement ? formatStatementPeriod(selectedStatement) : "No statement selected",
    },
    {
      label: "Closing balance",
      value: selectedStatement ? formatCurrency(selectedStatement.closingBalance) : "-",
      note: "At statement issue",
    },
    {
      label: "Included transactions",
      value: statementTransactions.length,
      note: "Within the selected statement period",
    },
  ];

  function handleDownloadPdf() {
    if (!selectedStatement || !selectedAccount) {
      return;
    }

    downloadStatementPdf(selectedStatement, selectedAccount, statementTransactions);
    showToast("PDF statement generated.");
  }

  function handleDownloadCsv() {
    if (!selectedStatement || !selectedAccount) {
      return;
    }

    downloadStatementCsv(selectedStatement, selectedAccount, statementTransactions);
    showToast("CSV statement generated.");
  }

  return (
    <AppShell railContent={<UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}>
      <div className="page-stack">
        <PageHeader
          title="Statements"
          subtitle="Review statement periods and export account activity to PDF or CSV."
        />
        <SummaryStrip items={summaryItems} />
        <InfoBanner
          title="Statement exports"
          message="Exports are generated locally for this demo environment and do not contain real banking records."
          tone="info"
        />

        <SectionPanel title="Statement selection">
          <div className="statement-toolbar">
            <div className="form-row">
              <label htmlFor="statementAccount">Account</label>
              <select
                id="statementAccount"
                value={selectedAccountId}
                onChange={(event) => setSelectedAccountId(event.target.value)}
                data-testid="statement-account-filter"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.productName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="statementPeriod">Statement period</label>
              <select
                id="statementPeriod"
                value={selectedStatementId}
                onChange={(event) => setSelectedStatementId(event.target.value)}
                data-testid="statement-period-filter"
              >
                {visibleStatements.map((statement) => (
                  <option key={statement.id} value={statement.id}>
                    {formatStatementPeriod(statement)}
                  </option>
                ))}
              </select>
            </div>
            <div className="button-row statement-toolbar__actions">
              <button
                type="button"
                className="button-primary"
                onClick={handleDownloadPdf}
                data-testid="statement-download-pdf"
              >
                Download PDF
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={handleDownloadCsv}
                data-testid="statement-download-csv"
              >
                Download CSV
              </button>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Available statements">
          <table className="data-table">
            <thead>
              <tr>
                <th>Statement</th>
                <th>Period</th>
                <th>Issue Date</th>
                <th className="numeric">Closing Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleStatements.map((statement) => (
                <tr key={statement.id}>
                  <td>{statement.statementName}</td>
                  <td>{formatStatementPeriod(statement)}</td>
                  <td>{formatDisplayDate(statement.issueDate)}</td>
                  <td className="numeric">
                    {formatCurrency(statement.closingBalance)}
                  </td>
                  <td>
                    <StatusPill
                      status={
                        statement.id === selectedStatement?.id ? "Selected" : "Available"
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="table-action"
                      onClick={() => setSelectedStatementId(statement.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionPanel>

        <SectionPanel title="Statement preview">
          {selectedStatement && selectedAccount ? (
            <div className="statement-preview">
              <div className="statement-preview__summary">
                <dl className="review-grid">
                  <dt>Account</dt>
                  <dd>{selectedAccount.productName}</dd>
                  <dt>Period</dt>
                  <dd>{formatStatementPeriod(selectedStatement)}</dd>
                  <dt>Issue date</dt>
                  <dd>{formatDisplayDate(selectedStatement.issueDate)}</dd>
                  <dt>Opening balance</dt>
                  <dd>{formatCurrency(selectedStatement.openingBalance)}</dd>
                  <dt>Closing balance</dt>
                  <dd>{formatCurrency(selectedStatement.closingBalance)}</dd>
                  <dt>Total credits</dt>
                  <dd>{formatCurrency(selectedStatement.totalCredits)}</dd>
                  <dt>Total debits</dt>
                  <dd>{formatCurrency(selectedStatement.totalDebits)}</dd>
                </dl>
              </div>
              <div className="statement-preview__table">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Reference</th>
                      <th>Status</th>
                      <th className="numeric">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statementTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{formatDisplayDate(transaction.date)}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.reference}</td>
                        <td>
                          <StatusPill status={transaction.status} />
                        </td>
                        <td className="numeric">{formatCurrency(transaction.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>No statement is available for the current selection.</div>
          )}
        </SectionPanel>
      </div>
    </AppShell>
  );
}

export default StatementsPage;

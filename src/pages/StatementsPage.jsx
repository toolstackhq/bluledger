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

  if (statements.length === 0) {
    return (
      <AppShell railContent={<UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}>
        <div className="page-stack">
          <PageHeader
            eyebrow="Documents"
            title="Statements"
            subtitle="Review statement periods and export account activity to PDF or CSV."
          />
          <SectionPanel title="Statements">
            <div className="empty-state">
              <h3>No statements available</h3>
              <p>No statements are available for this customer at this time.</p>
            </div>
          </SectionPanel>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell railContent={<UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}>
      <div className="page-stack">
        <PageHeader
          eyebrow="Documents"
          title="Statements"
          subtitle="Review statement periods and export account activity to PDF or CSV."
          actions={
            <>
              <button
                type="button"
                className="button-secondary"
                onClick={handleDownloadCsv}
                data-testid="statement-download-csv"
              >
                Download CSV
              </button>
              <button
                type="button"
                className="button-primary"
                onClick={handleDownloadPdf}
                data-testid="statement-download-pdf"
              >
                Download PDF
              </button>
            </>
          }
        />
        <SummaryStrip items={summaryItems} />
        <InfoBanner
          title="Statement exports"
          message="Exports are generated locally for this demo environment and do not contain real banking records."
          tone="info"
        />

        <SectionPanel
          title="Statement selection"
          subtitle="Choose the product and statement period you want to review"
        >
          <div className="statement-selection-grid">
            <div className="statement-selection-grid__filters">
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
            </div>

            {selectedStatement && selectedAccount ? (
              <div className="statement-hero">
                <div className="statement-hero__eyebrow">Selected statement</div>
                <h3>{selectedStatement.statementName}</h3>
                <div className="statement-hero__period">
                  {formatStatementPeriod(selectedStatement)}
                </div>
                <div className="statement-hero__meta">
                  <div>
                    <span className="utility-label">Account</span>
                    <strong>{selectedAccount.productName}</strong>
                  </div>
                  <div>
                    <span className="utility-label">Issued</span>
                    <strong>{formatDisplayDate(selectedStatement.issueDate)}</strong>
                  </div>
                  <div>
                    <span className="utility-label">Closing balance</span>
                    <strong>{formatCurrency(selectedStatement.closingBalance)}</strong>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Available statements"
          subtitle="Recent statement documents for the selected product"
        >
          {visibleStatements.length > 0 ? (
            <div className="statement-list">
              {visibleStatements.map((statement) => (
                <button
                  type="button"
                  key={statement.id}
                  className={`statement-list__item${
                    statement.id === selectedStatement?.id ? " is-selected" : ""
                  }`}
                  onClick={() => setSelectedStatementId(statement.id)}
                >
                  <div className="statement-list__primary">
                    <div className="statement-list__title">{statement.statementName}</div>
                    <div className="table-subline">{formatStatementPeriod(statement)}</div>
                  </div>
                  <div className="statement-list__meta">
                    <div>
                      <span className="utility-label">Issue date</span>
                      <strong>{formatDisplayDate(statement.issueDate)}</strong>
                    </div>
                    <div>
                      <span className="utility-label">Closing balance</span>
                      <strong>{formatCurrency(statement.closingBalance)}</strong>
                    </div>
                    <div className="statement-list__status">
                      <StatusPill
                        status={
                          statement.id === selectedStatement?.id ? "Selected" : "Available"
                        }
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No statements for this account</h3>
              <p>No statement records are available for the selected product.</p>
            </div>
          )}
        </SectionPanel>

        <SectionPanel
          title="Statement preview"
          subtitle="Review the selected statement totals and included activity"
        >
          {selectedStatement && selectedAccount ? (
            <div className="statement-document">
              <div className="statement-document__header">
                <div>
                  <div className="statement-document__eyebrow">
                    {selectedStatement.statementName}
                  </div>
                  <h3>{selectedAccount.productName}</h3>
                  <p>{formatStatementPeriod(selectedStatement)}</p>
                </div>
                <div className="statement-document__totals">
                  <div>
                    <span className="utility-label">Opening</span>
                    <strong>{formatCurrency(selectedStatement.openingBalance)}</strong>
                  </div>
                  <div>
                    <span className="utility-label">Closing</span>
                    <strong>{formatCurrency(selectedStatement.closingBalance)}</strong>
                  </div>
                </div>
              </div>

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
                        <th>Details</th>
                        <th>Status</th>
                        <th className="numeric">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{formatDisplayDate(transaction.date)}</td>
                          <td>
                            <div>{transaction.description}</div>
                            <div className="table-subline">{transaction.reference}</div>
                          </td>
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

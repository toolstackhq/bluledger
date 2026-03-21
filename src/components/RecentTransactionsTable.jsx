import { formatCurrency } from "../utils/currency";
import { formatDisplayDate } from "../utils/date";
import StatusPill from "./StatusPill";

function RecentTransactionsTable({ transactions }) {
  return (
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
        {transactions.map((transaction) => (
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
  );
}

export default RecentTransactionsTable;

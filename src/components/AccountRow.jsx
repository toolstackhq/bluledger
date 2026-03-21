import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";
import { maskAccountNumber } from "../utils/masking";
import StatusPill from "./StatusPill";

function AccountRow({ account }) {
  const canTransferFrom = !["credit", "loan"].includes(account.type);

  return (
    <tr data-testid={`dashboard-account-row-${account.slug}`}>
      <td>
        <div>{account.productName}</div>
        <div className="table-subline">{account.nickname}</div>
      </td>
      <td>
        <div>{maskAccountNumber(account.accountNumber)}</div>
        <div className="table-subline">{account.bsb === "N/A" ? "Card account" : `BSB ${account.bsb}`}</div>
      </td>
      <td className="numeric">{formatCurrency(account.currentBalance)}</td>
      <td className="numeric">{formatCurrency(account.availableBalance)}</td>
      <td>
        <StatusPill status={account.status} />
      </td>
      <td>
        {canTransferFrom ? (
          <Link className="button-link" to="/transfers">
            Transfer
          </Link>
        ) : (
          <span className="table-subline">View only</span>
        )}
      </td>
    </tr>
  );
}

export default AccountRow;

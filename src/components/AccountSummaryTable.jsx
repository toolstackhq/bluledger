import AccountRow from "./AccountRow";

function AccountSummaryTable({ accounts }) {
  return (
    <table className="data-table" data-testid="dashboard-account-summary">
      <thead>
        <tr>
          <th>Product</th>
          <th>Account Details</th>
          <th className="numeric">Current Balance</th>
          <th className="numeric">Available Balance</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}
      </tbody>
    </table>
  );
}

export default AccountSummaryTable;

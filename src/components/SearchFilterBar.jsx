function SearchFilterBar({ filters, onChange, accounts }) {
  return (
    <div className="search-filter-bar" role="search" aria-label="Transaction filters">
      <div className="form-row">
        <label htmlFor="transaction-search">Search</label>
        <input
          id="transaction-search"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search description or reference"
          data-testid="transactions-search"
        />
      </div>
      <div className="form-row">
        <label htmlFor="transaction-account">Account</label>
        <select
          id="transaction-account"
          value={filters.accountId}
          onChange={(event) => onChange("accountId", event.target.value)}
          data-testid="transactions-account-filter"
        >
          <option value="all">All accounts</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.productName}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="transaction-type">Type</label>
        <select
          id="transaction-type"
          value={filters.type}
          onChange={(event) => onChange("type", event.target.value)}
        >
          <option value="all">All types</option>
          <option value="Debit">Debit</option>
          <option value="Credit">Credit</option>
          <option value="Transfer">Transfer</option>
          <option value="Card payment">Card payment</option>
          <option value="Scheduled payment">Scheduled payment</option>
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="transaction-status">Status</label>
        <select
          id="transaction-status"
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilterBar;

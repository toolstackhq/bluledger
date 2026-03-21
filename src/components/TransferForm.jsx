import { useMemo, useState } from "react";
import { formatAccountLabel, formatPayeeLabel } from "../utils/formatters";
import { todayInputValue } from "../utils/date";

function TransferForm({
  accounts,
  payees,
  transferDefaults,
  initialDraft,
  onSubmit,
}) {
  const sourceAccounts = accounts.filter((account) => account.type !== "credit");
  const defaultFromAccount = sourceAccounts[0]?.id || "";

  const [formValues, setFormValues] = useState({
    fromAccountId: initialDraft?.fromAccountId || defaultFromAccount,
    destinationType: initialDraft?.destinationType || "own",
    destinationId: initialDraft?.destinationId || "",
    amount: initialDraft?.amount || "",
    reference: initialDraft?.reference || "",
    note: initialDraft?.note || "",
    transferDateType: initialDraft?.transferDateType || "today",
    scheduledDate: initialDraft?.scheduledDate || todayInputValue(),
  });
  const [errors, setErrors] = useState({});

  const ownAccountOptions = useMemo(
    () =>
      accounts.filter((account) => account.id !== formValues.fromAccountId),
    [accounts, formValues.fromAccountId]
  );

  const destinationOptions =
    formValues.destinationType === "own" ? ownAccountOptions : payees;

  function updateField(name, value) {
    setFormValues((current) => ({
      ...current,
      [name]: value,
      ...(name === "fromAccountId" && current.destinationId === value
        ? { destinationId: "" }
        : {}),
    }));
  }

  function validate() {
    const nextErrors = {};
    const sourceAccount = accounts.find(
      (account) => account.id === formValues.fromAccountId
    );

    if (!formValues.fromAccountId) {
      nextErrors.fromAccountId = "Select a source account.";
    }

    if (!formValues.destinationId) {
      nextErrors.destinationId = "Select a destination.";
    }

    if (
      formValues.destinationType === "own" &&
      formValues.destinationId &&
      formValues.destinationId === formValues.fromAccountId
    ) {
      nextErrors.destinationId = "Choose a different destination account.";
    }

    if (!formValues.amount || Number(formValues.amount) <= 0) {
      nextErrors.amount = "Enter an amount greater than zero.";
    }

    if (
      sourceAccount &&
      Number(formValues.amount) > Number(sourceAccount.availableBalance)
    ) {
      nextErrors.amount = "Amount exceeds the available balance.";
    }

    if (!formValues.reference.trim()) {
      nextErrors.reference = "Enter a payment reference.";
    }

    if (
      formValues.transferDateType === "future" &&
      !formValues.scheduledDate.trim()
    ) {
      nextErrors.scheduledDate = "Select a future payment date.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formValues,
      amount: Number(formValues.amount),
      reference: formValues.reference.trim(),
      note: formValues.note.trim(),
    });
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="inline-grid">
        <div className="form-row">
          <label htmlFor="fromAccountId">From account</label>
          <select
            id="fromAccountId"
            value={formValues.fromAccountId}
            onChange={(event) => updateField("fromAccountId", event.target.value)}
            data-testid="transfer-from-account"
          >
            {sourceAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {formatAccountLabel(account)}
              </option>
            ))}
          </select>
          {errors.fromAccountId ? <span className="form-error">{errors.fromAccountId}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="destinationType">Destination type</label>
          <select
            id="destinationType"
            value={formValues.destinationType}
            onChange={(event) => {
              setFormValues((current) => ({
                ...current,
                destinationType: event.target.value,
                destinationId: "",
              }));
            }}
            data-testid="transfer-destination-type"
          >
            <option value="own">Own account</option>
            <option value="payee">Saved payee</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="destinationId">
          {formValues.destinationType === "own" ? "Destination account" : "Saved payee"}
        </label>
        <select
          id="destinationId"
          value={formValues.destinationId}
          onChange={(event) => updateField("destinationId", event.target.value)}
          data-testid={
            formValues.destinationType === "own"
              ? "transfer-own-account"
              : "transfer-payee"
          }
        >
          <option value="">Select</option>
          {destinationOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {formValues.destinationType === "own"
                ? formatAccountLabel(option)
                : formatPayeeLabel(option)}
            </option>
          ))}
        </select>
        {errors.destinationId ? <span className="form-error">{errors.destinationId}</span> : null}
      </div>

      <div className="inline-grid">
        <div className="form-row">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={formValues.amount}
            onChange={(event) => updateField("amount", event.target.value)}
            data-testid="transfer-amount"
          />
          {Number(formValues.amount) > transferDefaults.warningThreshold ? (
            <span className="form-hint">
              This amount is above your usual transfer threshold and may be reviewed.
            </span>
          ) : null}
          {errors.amount ? <span className="form-error">{errors.amount}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="reference">Reference</label>
          <input
            id="reference"
            type="text"
            maxLength="24"
            value={formValues.reference}
            onChange={(event) => updateField("reference", event.target.value)}
            placeholder={transferDefaults.referencePrefix}
            data-testid="transfer-reference"
          />
          {errors.reference ? <span className="form-error">{errors.reference}</span> : null}
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="note">Optional note</label>
        <textarea
          id="note"
          value={formValues.note}
          onChange={(event) => updateField("note", event.target.value)}
          data-testid="transfer-note"
        />
      </div>

      <div className="inline-grid">
        <div className="form-row">
          <label htmlFor="transferDateType">Transfer date</label>
          <select
            id="transferDateType"
            value={formValues.transferDateType}
            onChange={(event) => updateField("transferDateType", event.target.value)}
            data-testid="transfer-date"
          >
            <option value="today">Today</option>
            <option value="future">Future date</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="scheduledDate">Scheduled date</label>
          <input
            id="scheduledDate"
            type="date"
            min={todayInputValue()}
            disabled={formValues.transferDateType !== "future"}
            value={formValues.scheduledDate}
            onChange={(event) => updateField("scheduledDate", event.target.value)}
          />
          {errors.scheduledDate ? <span className="form-error">{errors.scheduledDate}</span> : null}
        </div>
      </div>

      <div className="form-hint">{transferDefaults.processingCutoff}</div>

      <div className="button-row">
        <button type="submit" className="button-primary" data-testid="transfer-continue">
          Continue
        </button>
      </div>
    </form>
  );
}

export default TransferForm;

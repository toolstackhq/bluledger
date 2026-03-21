import { createContext, useContext, useEffect, useMemo, useState } from "react";
import bankData from "../data/bankData.json";
import { generateReceiptNumber } from "../utils/receipt";
import {
  clearRememberedCustomerId,
  clearStoredAppState,
  loadRememberedCustomerId,
  loadStoredAppState,
  saveRememberedCustomerId,
  saveStoredAppState,
} from "../utils/storage";

const AppContext = createContext(null);

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeCollectionById(defaultItems, storedItems) {
  if (!Array.isArray(storedItems)) {
    return cloneValue(defaultItems);
  }

  return defaultItems.map((defaultItem) => {
    const storedItem = storedItems.find((item) => item.id === defaultItem.id);
    return storedItem ? { ...defaultItem, ...storedItem } : defaultItem;
  });
}

function buildDefaultMutableState() {
  return {
    session: {
      isAuthenticated: false,
      customerId: "",
      rememberCustomerId: false,
    },
    profile: cloneValue(bankData.profile),
    accounts: cloneValue(bankData.accounts),
    cards: cloneValue(bankData.cards),
    settings: cloneValue(bankData.settings),
    preferences: cloneValue(bankData.preferences),
    transactions: cloneValue(bankData.transactions),
    transferDraft: null,
    receiptSeed: cloneValue(bankData.receiptSeed),
    toast: null,
  };
}

function getInitialMutableState() {
  const storedState = loadStoredAppState();
  const defaultState = buildDefaultMutableState();

  if (!storedState) {
    return defaultState;
  }

  return {
    ...defaultState,
    ...storedState,
    session: {
      ...defaultState.session,
      ...storedState.session,
    },
    accounts: mergeCollectionById(defaultState.accounts, storedState.accounts),
    cards: mergeCollectionById(defaultState.cards, storedState.cards),
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(getInitialMutableState);
  const [rememberedCustomerId, setRememberedCustomerId] = useState(
    loadRememberedCustomerId()
  );

  useEffect(() => {
    saveStoredAppState(state);
  }, [state]);

  const isAuthenticated = state.session.isAuthenticated;

  const dashboardSummary = useMemo(() => {
    const nonCreditAccounts = state.accounts.filter(
      (account) => account.type !== "credit"
    );
    const totalBalance = nonCreditAccounts.reduce(
      (total, account) => total + Number(account.currentBalance),
      0
    );
    const availableFunds = nonCreditAccounts.reduce(
      (total, account) => total + Number(account.availableBalance),
      0
    );
    const pendingTransactions = state.transactions.filter(
      (transaction) => transaction.status === "Pending"
    ).length;

    return {
      totalBalance,
      availableFunds,
      pendingTransactions,
      upcomingPayments: bankData.activitySummary.upcomingPayments,
    };
  }, [state.accounts, state.transactions]);

  function showToast(message, tone = "success") {
    setState((currentState) => ({
      ...currentState,
      toast: {
        id: Date.now(),
        message,
        tone,
      },
    }));
  }

  function dismissToast() {
    setState((currentState) => ({
      ...currentState,
      toast: null,
    }));
  }

  function login(customerId, password, rememberCustomerIdSelection) {
    const credentialsMatch =
      customerId === bankData.demoCredentials.customerId &&
      password === bankData.demoCredentials.password;

    if (!credentialsMatch) {
      return {
        ok: false,
        message: "Customer ID or password is incorrect.",
      };
    }

    if (rememberCustomerIdSelection) {
      saveRememberedCustomerId(customerId);
      setRememberedCustomerId(customerId);
    } else {
      clearRememberedCustomerId();
      setRememberedCustomerId("");
    }

    setState((currentState) => ({
      ...currentState,
      session: {
        isAuthenticated: true,
        customerId,
        rememberCustomerId: rememberCustomerIdSelection,
      },
    }));

    return { ok: true };
  }

  function logout() {
    const nextRememberedId = state.session.rememberCustomerId
      ? state.session.customerId
      : "";

    if (nextRememberedId) {
      saveRememberedCustomerId(nextRememberedId);
      setRememberedCustomerId(nextRememberedId);
    } else {
      clearRememberedCustomerId();
      setRememberedCustomerId("");
    }

    clearStoredAppState();
    setState(buildDefaultMutableState());
  }

  function saveProfile(nextProfile) {
    setState((currentState) => ({
      ...currentState,
      profile: nextProfile,
    }));

    showToast("Your details have been updated.");
  }

  function saveSettings(nextSettings, nextPreferences) {
    setState((currentState) => ({
      ...currentState,
      settings: nextSettings,
      preferences: nextPreferences,
    }));

    showToast("Preferences saved.");
  }

  function updateCard(cardId, updates, message) {
    setState((currentState) => ({
      ...currentState,
      cards: currentState.cards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      ),
    }));

    showToast(message);
  }

  function saveTransferDraft(draft) {
    setState((currentState) => ({
      ...currentState,
      transferDraft: draft,
    }));
  }

  function clearTransferDraft() {
    setState((currentState) => ({
      ...currentState,
      transferDraft: null,
    }));
  }

  function confirmTransfer() {
    let successDetails = null;

    setState((currentState) => {
      if (!currentState.transferDraft) {
        return currentState;
      }

      const draft = currentState.transferDraft;
      const amount = Number(draft.amount);
      const isOwnAccount = draft.destinationType === "own";
      const scheduledDate =
        draft.transferDateType === "future"
          ? draft.scheduledDate
          : new Date().toISOString().slice(0, 10);
      const timestamp = new Date().toISOString();
      const receipt = generateReceiptNumber(currentState.receiptSeed);

      const sourceAccount = currentState.accounts.find(
        (account) => account.id === draft.fromAccountId
      );

      const destinationAccount = isOwnAccount
        ? currentState.accounts.find((account) => account.id === draft.destinationId)
        : null;
      const destinationPayee = !isOwnAccount
        ? bankData.payees.find((payee) => payee.id === draft.destinationId)
        : null;

      const status =
        draft.transferDateType === "future" ? "Pending" : "Completed";
      const type =
        draft.transferDateType === "future" ? "Scheduled payment" : "Transfer";

      const updatedAccounts = currentState.accounts.map((account) => {
        if (draft.transferDateType === "future") {
          return account;
        }

        if (account.id === sourceAccount.id) {
          return {
            ...account,
            currentBalance: Number((account.currentBalance - amount).toFixed(2)),
            availableBalance: Number(
              (account.availableBalance - amount).toFixed(2)
            ),
          };
        }

        if (destinationAccount && account.id === destinationAccount.id) {
          return {
            ...account,
            currentBalance: Number((account.currentBalance + amount).toFixed(2)),
            availableBalance: Number(
              (account.availableBalance + amount).toFixed(2)
            ),
          };
        }

        return account;
      });

      const nextSourceBalance =
        draft.transferDateType === "future"
          ? sourceAccount.currentBalance
          : Number((sourceAccount.currentBalance - amount).toFixed(2));

      const outgoingTransaction = {
        id: `txn-${receipt.receiptNumber}-out`,
        accountId: sourceAccount.id,
        date: scheduledDate,
        description: isOwnAccount
          ? `Transfer to ${destinationAccount.productName}`
          : `Payment to ${destinationPayee.name}`,
        reference: draft.reference,
        amount: Number((-amount).toFixed(2)),
        type,
        status,
        balance: nextSourceBalance,
        category: "transfer",
      };

      const incomingTransaction =
        destinationAccount && draft.transferDateType !== "future"
          ? {
              id: `txn-${receipt.receiptNumber}-in`,
              accountId: destinationAccount.id,
              date: scheduledDate,
              description: `Transfer from ${sourceAccount.productName}`,
              reference: draft.reference,
              amount: Number(amount.toFixed(2)),
              type: "Transfer",
              status: "Completed",
              balance: Number(
                (destinationAccount.currentBalance + amount).toFixed(2)
              ),
              category: "transfer",
            }
          : null;

      const updatedTransactions = incomingTransaction
        ? [outgoingTransaction, incomingTransaction, ...currentState.transactions]
        : [outgoingTransaction, ...currentState.transactions];

      successDetails = {
        receiptNumber: receipt.receiptNumber,
        amount,
        sourceLabel: sourceAccount.productName,
        destinationLabel: destinationAccount
          ? destinationAccount.productName
          : destinationPayee.name,
        reference: draft.reference,
        note: draft.note,
        scheduledDate,
        timestamp,
        status,
      };

      return {
        ...currentState,
        accounts: updatedAccounts,
        transactions: updatedTransactions,
        transferDraft: null,
        receiptSeed: receipt.nextSeed,
        toast: null,
      };
    });

    return successDetails;
  }

  const value = {
    appMeta: bankData.appMeta,
    user: bankData.user,
    demoCredentials: bankData.demoCredentials,
    payees: bankData.payees,
    alerts: bankData.alerts,
    banners: bankData.banners,
    quickLinks: bankData.quickLinks,
    statements: bankData.statements,
    utilityPanel: bankData.utilityPanel,
    cardOptions: bankData.cardOptions,
    transferDefaults: bankData.transferDefaults,
    accounts: state.accounts,
    cards: state.cards,
    profile: state.profile,
    settings: state.settings,
    preferences: state.preferences,
    transactions: state.transactions,
    transferDraft: state.transferDraft,
    toast: state.toast,
    dashboardSummary,
    rememberedCustomerId,
    isAuthenticated,
    login,
    logout,
    saveProfile,
    saveSettings,
    updateCard,
    saveTransferDraft,
    clearTransferDraft,
    confirmTransfer,
    showToast,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}

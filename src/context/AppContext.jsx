import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import bankData from "../data/bankData.json";
import testUsers from "../data/testUsers.json";
import { generateReceiptNumber } from "../utils/receipt";
import {
  clearPerformanceConfig,
  clearRememberedCustomerId,
  clearStoredAppState,
  loadPerformanceConfig,
  loadRememberedCustomerId,
  loadStoredAppState,
  savePerformanceConfig,
  saveRememberedCustomerId,
  saveStoredAppState,
} from "../utils/storage";

const AppContext = createContext(null);
const DEFAULT_PERFORMANCE_CONFIG = {
  mode: "fast",
  minDelayMs: 2000,
  maxDelayMs: 10000,
};

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

function getDefaultTestUser() {
  return testUsers[0];
}

function getTestUserRecord(customerId) {
  return testUsers.find((testUser) => testUser.customerId === customerId) || null;
}

function buildMutableStateForUser(testUser, sessionOverrides = {}) {
  return {
    session: {
      isAuthenticated: false,
      customerId: "",
      rememberCustomerId: false,
      ...sessionOverrides,
    },
    activeCustomerId: testUser.customerId,
    user: cloneValue(testUser.user),
    profile: cloneValue(testUser.profile),
    accounts: cloneValue(testUser.accounts),
    cards: cloneValue(testUser.cards),
    payees: cloneValue(testUser.payees),
    alerts: cloneValue(testUser.alerts),
    banners: cloneValue(testUser.banners),
    settings: cloneValue(testUser.settings),
    preferences: cloneValue(testUser.preferences),
    transactions: cloneValue(testUser.transactions),
    statements: cloneValue(testUser.statements),
    utilityPanel: cloneValue(testUser.utilityPanel),
    activitySummary: cloneValue(testUser.activitySummary),
    transferDraft: null,
    receiptSeed: cloneValue(testUser.receiptSeed),
    toast: null,
  };
}

function buildDefaultMutableState() {
  return buildMutableStateForUser(getDefaultTestUser());
}

function getInitialMutableState() {
  const storedState = loadStoredAppState();
  const baseUser =
    getTestUserRecord(storedState?.activeCustomerId || storedState?.session?.customerId) ||
    getDefaultTestUser();
  const defaultState = buildMutableStateForUser(baseUser);

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

function deriveUpcomingPayments(state) {
  const pendingScheduledPayments = state.transactions.filter(
    (transaction) =>
      transaction.status === "Pending" &&
      transaction.type === "Scheduled payment"
  ).length;

  return state.activitySummary?.upcomingPayments ?? pendingScheduledPayments;
}

function normalizePerformanceConfig(config) {
  if (!config) {
    return DEFAULT_PERFORMANCE_CONFIG;
  }

  const minDelayMs = Number(config.minDelayMs);
  const maxDelayMs = Number(config.maxDelayMs);
  const normalizedMin = Number.isFinite(minDelayMs) ? Math.max(0, minDelayMs) : 2000;
  const normalizedMax = Number.isFinite(maxDelayMs)
    ? Math.max(normalizedMin, maxDelayMs)
    : 10000;
  const mode = ["fast", "variable", "slow"].includes(config.mode) ? config.mode : "fast";

  return {
    mode,
    minDelayMs: normalizedMin,
    maxDelayMs: normalizedMax,
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(getInitialMutableState);
  const [rememberedCustomerId, setRememberedCustomerId] = useState(
    loadRememberedCustomerId()
  );
  const [performanceConfig, setPerformanceConfig] = useState(() =>
    normalizePerformanceConfig(loadPerformanceConfig())
  );
  const [loadingOverlay, setLoadingOverlay] = useState({
    visible: false,
    message: "",
  });
  const featureFlags = {
    helpCenterEnabled: bankData.featureFlags?.helpCenterEnabled ?? true,
  };

  useEffect(() => {
    saveStoredAppState(state);
  }, [state]);

  useEffect(() => {
    savePerformanceConfig(performanceConfig);
  }, [performanceConfig]);

  const isAuthenticated = state.session.isAuthenticated;

  const dashboardSummary = useMemo(() => {
    const liquidAccounts = state.accounts.filter(
      (account) => !["credit", "loan"].includes(account.type)
    );
    const totalBalance = liquidAccounts.reduce(
      (total, account) => total + Number(account.currentBalance),
      0
    );
    const availableFunds = liquidAccounts.reduce(
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
      upcomingPayments: deriveUpcomingPayments(state),
    };
  }, [state]);

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

  const updatePerformanceConfig = useCallback((nextConfig) => {
    setPerformanceConfig(normalizePerformanceConfig(nextConfig));
  }, []);

  const resetPerformanceConfig = useCallback(() => {
    clearPerformanceConfig();
    setPerformanceConfig(DEFAULT_PERFORMANCE_CONFIG);
  }, []);

  const getPerformanceDelayMs = useCallback(() => {
    if (performanceConfig.mode === "fast") {
      return 0;
    }

    const range = performanceConfig.maxDelayMs - performanceConfig.minDelayMs;
    const baseDelay =
      performanceConfig.minDelayMs + Math.floor(Math.random() * (range + 1));

    if (performanceConfig.mode === "variable") {
      return Math.max(200, Math.round(baseDelay * 0.45));
    }

    return baseDelay;
  }, [performanceConfig.maxDelayMs, performanceConfig.minDelayMs, performanceConfig.mode]);

  const showLoadingOverlay = useCallback((message) => {
    setLoadingOverlay({
      visible: true,
      message,
    });
  }, []);

  const clearLoadingOverlay = useCallback(() => {
    setLoadingOverlay({
      visible: false,
      message: "",
    });
  }, []);

  function login(customerId, password, rememberCustomerIdSelection) {
    const selectedUser = getTestUserRecord(customerId);

    if (!selectedUser || password !== selectedUser.password) {
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

    setState(
      buildMutableStateForUser(selectedUser, {
        isAuthenticated: true,
        customerId,
        rememberCustomerId: rememberCustomerIdSelection,
      })
    );

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
    if (!state.transferDraft) {
      return null;
    }

    const draft = state.transferDraft;
    const amount = Number(draft.amount);
    const isOwnAccount = draft.destinationType === "own";
    const scheduledDate =
      draft.transferDateType === "future"
        ? draft.scheduledDate
        : new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();
    const receipt = generateReceiptNumber(state.receiptSeed);

    const sourceAccount = state.accounts.find(
      (account) => account.id === draft.fromAccountId
    );

    const destinationAccount = isOwnAccount
      ? state.accounts.find((account) => account.id === draft.destinationId)
      : null;
    const destinationPayee = !isOwnAccount
      ? state.payees.find((payee) => payee.id === draft.destinationId)
      : null;

    const status = draft.transferDateType === "future" ? "Pending" : "Completed";
    const type = draft.transferDateType === "future" ? "Scheduled payment" : "Transfer";

    const updatedAccounts = state.accounts.map((account) => {
      if (draft.transferDateType === "future") {
        return account;
      }

      if (account.id === sourceAccount.id) {
        return {
          ...account,
          currentBalance: Number((account.currentBalance - amount).toFixed(2)),
          availableBalance: Number((account.availableBalance - amount).toFixed(2)),
        };
      }

      if (destinationAccount && account.id === destinationAccount.id) {
        return {
          ...account,
          currentBalance: Number((account.currentBalance + amount).toFixed(2)),
          availableBalance: Number((account.availableBalance + amount).toFixed(2)),
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
            balance: Number((destinationAccount.currentBalance + amount).toFixed(2)),
            category: "transfer",
          }
        : null;

    const updatedTransactions = incomingTransaction
      ? [outgoingTransaction, incomingTransaction, ...state.transactions]
      : [outgoingTransaction, ...state.transactions];

    const successDetails = {
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

    setState((currentState) => ({
      ...currentState,
      accounts: updatedAccounts,
      transactions: updatedTransactions,
      transferDraft: null,
      receiptSeed: receipt.nextSeed,
      toast: null,
    }));

    return successDetails;
  }

  const value = {
    appMeta: bankData.appMeta,
    quickLinks: bankData.quickLinks,
    cardOptions: bankData.cardOptions,
    transferDefaults: bankData.transferDefaults,
    user: state.user,
    profile: state.profile,
    accounts: state.accounts,
    cards: state.cards,
    payees: state.payees,
    alerts: state.alerts,
    banners: state.banners,
    settings: state.settings,
    preferences: state.preferences,
    transactions: state.transactions,
    statements: state.statements,
    utilityPanel: state.utilityPanel,
    transferDraft: state.transferDraft,
    toast: state.toast,
    dashboardSummary,
    loadingOverlay,
    performanceConfig,
    rememberedCustomerId,
    featureFlags,
    testUsers: testUsers.map((testUser) => ({
      customerId: testUser.customerId,
      password: testUser.password,
      scenarioLabel: testUser.scenarioLabel,
      scenarioDescription: testUser.scenarioDescription,
    })),
    isAuthenticated,
    updatePerformanceConfig,
    resetPerformanceConfig,
    getPerformanceDelayMs,
    showLoadingOverlay,
    clearLoadingOverlay,
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

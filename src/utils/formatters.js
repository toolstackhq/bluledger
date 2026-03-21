import { maskAccountNumber } from "./masking";

export function formatAccountLabel(account) {
  return `${account.productName} • ${maskAccountNumber(account.accountNumber)}`;
}

export function formatPayeeLabel(payee) {
  return `${payee.nickname} • ${payee.bsb} ${payee.accountNumber}`;
}

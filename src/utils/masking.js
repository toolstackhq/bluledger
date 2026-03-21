export function maskAccountNumber(accountNumber) {
  const visibleDigits = String(accountNumber).slice(-4);
  return `••••${visibleDigits}`;
}

export function maskCardNumber(maskedNumber, lastFour) {
  if (maskedNumber) {
    return maskedNumber;
  }

  return `•••• •••• •••• ${lastFour}`;
}

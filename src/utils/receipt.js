export function generateReceiptNumber(seed) {
  const receiptNumber = `${seed.prefix}${String(seed.nextSequence).padStart(6, "0")}`;

  return {
    receiptNumber,
    nextSeed: {
      ...seed,
      nextSequence: seed.nextSequence + 1,
    },
  };
}

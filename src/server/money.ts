export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function parseNumber(value: FormDataEntryValue | null) {
  const n = Number((value ?? "").toString());
  return Number.isFinite(n) ? n : 0;
}

export function toDecimalString(value: number) {
  return roundMoney(value).toFixed(2);
}

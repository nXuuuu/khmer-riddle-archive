// Turns Western digits into Khmer digits: 12 → ១២. Other characters are kept.
const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";

export function toKhmerDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => KHMER_DIGITS[d]);
}

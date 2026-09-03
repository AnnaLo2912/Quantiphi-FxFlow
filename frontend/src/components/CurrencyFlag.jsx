const FLAGS = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", INR: "🇮🇳", JPY: "🇯🇵", CHF: "🇨🇭",
  CAD: "🇨🇦", AUD: "🇦🇺", CNY: "🇨🇳", BRL: "🇧🇷", KRW: "🇰🇷", MXN: "🇲🇽",
  SGD: "🇸🇬", HKD: "🇭🇰", NOK: "🇳🇴", SEK: "🇸🇪", DKK: "🇩🇰", PLN: "🇵🇱",
  CZK: "🇨🇿", HUF: "🇭🇺", RUB: "🇷🇺", TRY: "🇹🇷", ZAR: "🇿🇦", NZD: "🇳🇿",
  THB: "🇹🇭", IDR: "🇮🇩", MYR: "🇲🇾", PHP: "🇵🇭", VND: "🇻🇳", EGP: "🇪🇬",
  NGN: "🇳🇬", KES: "🇰🇪", GHS: "🇬🇭", AED: "🇦🇪", SAR: "🇸🇦", QAR: "🇶🇦",
  KWD: "🇰🇼", BHD: "🇧🇭", OMR: "🇴🇲", JOD: "🇯🇴", LBP: "🇱🇧", PKR: "🇵🇰",
  BDT: "🇧🇩", LKR: "🇱🇰", NPR: "🇳🇵", MMK: "🇲🇲", KHR: "🇰🇭", LAK: "🇱🇦",
  UZS: "🇺🇿", KZT: "🇰🇿", GEL: "🇬🇪", AMD: "🇦🇲", AZN: "🇦🇿", UAH: "🇺🇦",
  RON: "🇷🇴", BGN: "🇧🇬", HRK: "🇭🇷", RSD: "🇷🇸", BAM: "🇧🇦", ISK: "🇮🇸",
  ALL: "🇦🇱", MKD: "🇲🇰", MGA: "🇲🇬", TZS: "🇹🇿", UGX: "🇺🇬", ETB: "🇪🇹",
  GEL: "🇬🇪", BWP: "🇧🇼", SZL: "🇸🇿", LSL: "🇱🇸", NAD: "🇳🇦", MZN: "🇲🇿",
  ZMW: "🇿🇲", MWK: "🇲🇼", SCR: "🇸🇨", MUR: "🇲🇺", FJD: "🇫🇯", PGK: "🇵🇬",
  TOP: "🇹🇴", WST: "🇼🇸", VUV: "🇻🇺", SBD: "🇸🇧", BND: "🇧🇳", TTD: "🇹🇹",
  JMD: "🇯🇲", BSD: "🇧🇸", HTG: "🇭🇹", DOP: "🇩🇴", CUP: "🇨🇺", MXN: "🇲🇽",
  GTQ: "🇬🇹", HNL: "🇭🇳", NIO: "🇳🇮", CRC: "🇨🇷", PAB: "🇵🇦", VES: "🇻🇪",
  COP: "🇨🇴", PEN: "🇵🇪", BOB: "🇧🇴", CLP: "🇨🇱", ARS: "🇦🇷", UYU: "🇺🇾",
  PYG: "🇵🇾", SRD: "🇸🇷", GYD: "🇬🇾", XCD: "🇽🇨", BZD: "🇧🇿", AWG: "🇦🇼",
};

export default function CurrencyFlag({ code, size = "md" }) {
  const flag = FLAGS[code] || "🏳️";
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };
  return <span className={sizeClasses[size]}>{flag}</span>;
}

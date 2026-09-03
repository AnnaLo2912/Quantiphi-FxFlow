import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CurrencySelect({ value, onValueChange, currencies, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const filtered = currencies.filter((c) =>
    `${c.code} ${c.name}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = currencies.find((c) => c.code === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
      >
        <div className="flex items-center gap-2">
          {selected && (
            <span className="text-base">{getFlag(selected.code)}</span>
          )}
          <span className="font-medium">{value}</span>
          {selected && (
            <span className="text-muted-foreground text-xs hidden sm:inline">{selected.name}</span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl shadow-black/20 dark:shadow-black/50 overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full h-9 pl-8 pr-3 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring/50 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">No currencies found</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onValueChange(c.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-green/10 transition-colors",
                    value === c.code && "bg-green/5"
                  )}
                >
                  <span className="text-base">{getFlag(c.code)}</span>
                  <span className="font-medium w-10">{c.code}</span>
                  <span className="text-muted-foreground text-xs truncate flex-1 text-left">{c.name}</span>
                  {value === c.code && <Check className="h-3.5 w-3.5 text-green shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const FLAGS = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", INR: "🇮🇳", JPY: "🇯🇵", CHF: "🇨🇭",
  CAD: "🇨🇦", AUD: "🇦🇺", CNY: "🇨🇳", BRL: "🇧🇷", KRW: "🇰🇷", MXN: "🇲🇽",
  SGD: "🇸🇬", HKD: "🇭🇰", NOK: "🇳🇴", SEK: "🇸🇪", DKK: "🇩🇰", PLN: "🇵🇱",
  CZK: "🇨🇿", HUF: "🇭🇺", RUB: "🇷🇺", TRY: "🇹🇷", ZAR: "🇿🇦", NZD: "🇳🇿",
  THB: "🇹🇭", IDR: "🇮🇩", MYR: "🇲🇾", PHP: "🇵🇭", VND: "🇻🇳", EGP: "🇪🇬",
  NGN: "🇳🇬", KES: "🇰🇪", GHS: "🇬🇭", AED: "🇦🇪", SAR: "🇸🇦", QAR: "🇶🇦",
  KWD: "🇰🇼", BHD: "🇧🇭", OMR: "🇴🇲", JOD: "🇯🇴", PKR: "🇵🇰", BDT: "🇧🇩",
  LKR: "🇱🇰", NPR: "🇳🇵", MMK: "🇲🇲", KHR: "🇰🇭", LAK: "🇱🇦", UZS: "🇺🇿",
  KZT: "🇰🇿", GEL: "🇬🇪", AMD: "🇦🇲", AZN: "🇦🇿", UAH: "🇺🇦", RON: "🇷🇴",
  BGN: "🇧🇬", HRK: "🇭🇷", RSD: "🇷🇸", BAM: "🇧🇦", ISK: "🇮🇸", ALL: "🇦🇱",
  MKD: "🇲🇰", MGA: "🇲🇬", TZS: "🇹🇿", UGX: "🇺🇬", ETB: "🇪🇹", BWP: "🇧🇼",
  SZL: "🇸🇿", LSL: "🇱🇸", NAD: "🇳🇦", MZN: "🇲🇿", ZMW: "🇿🇲", MWK: "🇲🇼",
  SCR: "🇸🇨", MUR: "🇲🇺", FJD: "🇫🇯", PGK: "🇵🇬", TOP: "🇹🇴", WST: "🇼🇸",
  VUV: "🇻🇺", SBD: "🇸🇧", BND: "🇧🇳", TTD: "🇹🇹", JMD: "🇯🇲", BSD: "🇧🇸",
  HTG: "🇭🇹", DOP: "🇩🇴", CUP: "🇨🇺", GTQ: "🇬🇹", HNL: "🇭🇳", NIO: "🇳🇮",
  CRC: "🇨🇷", PAB: "🇵🇦", VES: "🇻🇪", COP: "🇨🇴", PEN: "🇵🇪", BOB: "🇧🇴",
  CLP: "🇨🇱", ARS: "🇦🇷", UYU: "🇺🇾", PYG: "🇵🇾", SRD: "🇸🇷", GYD: "🇬🇾",
  XCD: "🇽🇨", BZD: "🇧🇿", AWG: "🇦🇼", LBP: "🇱🇧",
};

function getFlag(code) {
  return FLAGS[code] || "🏳️";
}

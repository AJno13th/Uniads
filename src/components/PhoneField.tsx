"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  composeInternationalPhone,
  defaultPhoneCountryIso,
  getPhoneCountryByIso,
  phoneCountries,
} from "@/data/phone-countries";

type Props = {
  name?: string;
  required?: boolean;
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  /** @deprecated kept for callers; compact picker ignores select width classes */
  selectClassName?: string;
  defaultCountry?: string;
  defaultNational?: string;
  id?: string;
};

/**
 * Compact country-code chip (+44) + local number.
 * Hidden field `name` stores full +E.164 phone.
 */
export function PhoneField({
  name = "phone",
  required = true,
  label = "Phone / WhatsApp",
  labelClassName = "label",
  inputClassName = "input",
  defaultCountry = defaultPhoneCountryIso,
  defaultNational = "",
  id,
}: Props) {
  const autoId = useId();
  const fieldId = id ?? `phone-${autoId}`;
  const rootRef = useRef<HTMLDivElement>(null);

  // defaultCountry may be iso (GB) or dial code (44) from older callers
  const initialIso =
    getPhoneCountryByIso(defaultCountry)?.iso ||
    phoneCountries.find((c) => c.code === defaultCountry)?.iso ||
    defaultPhoneCountryIso;

  const [iso, setIso] = useState(initialIso);
  const [national, setNational] = useState(defaultNational);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected =
    getPhoneCountryByIso(iso) ||
    phoneCountries.find((c) => c.iso === defaultPhoneCountryIso)!;

  const composed = composeInternationalPhone(selected.code, national) ?? "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return phoneCountries;
    return phoneCountries.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.code.includes(q.replace(/^\+/, "")) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onDoc(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      {label ? (
        <label className={labelClassName} htmlFor={fieldId}>
          {label}
          {required ? " *" : ""}
        </label>
      ) : null}

      <div className="flex gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Country calling code"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-12 w-[4.6rem] items-center justify-center gap-0.5 rounded-md border border-line bg-white px-1 text-sm font-semibold text-navy shadow-sm transition hover:border-navy/40"
          >
            <span className="text-base leading-none" aria-hidden>
              {selected.flag}
            </span>
            <span>+{selected.code}</span>
          </button>

          {open && (
            <div className="absolute left-0 z-40 mt-1 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-line bg-white shadow-lg">
              <div className="border-b border-line p-2">
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search country or code"
                  className="w-full rounded-md border border-line px-2 py-1.5 text-sm text-navy outline-none focus:border-teal"
                />
              </div>
              <ul
                role="listbox"
                className="max-h-56 overflow-y-auto py-1 text-sm"
              >
                {filtered.map((c) => {
                  const active = c.iso === selected.iso;
                  return (
                    <li key={c.iso}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-cream ${
                          active ? "bg-cream font-semibold" : ""
                        }`}
                        onClick={() => {
                          setIso(c.iso);
                          setOpen(false);
                          setQuery("");
                        }}
                      >
                        <span className="w-6 text-base" aria-hidden>
                          {c.flag}
                        </span>
                        <span className="w-12 shrink-0 tabular-nums text-muted">
                          +{c.code}
                        </span>
                        <span className="truncate text-navy">{c.label}</span>
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="px-3 py-3 text-muted">No countries match.</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <input
          id={fieldId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          className={inputClassName}
          placeholder="Mobile number"
          value={national}
          onChange={(e) => setNational(e.target.value)}
          aria-label={label || "Phone number"}
        />
      </div>

      <input type="hidden" name={name} value={composed} />
      <input type="hidden" name={`${name}Country`} value={selected.code} />
      <input type="hidden" name={`${name}Iso`} value={selected.iso} />
    </div>
  );
}

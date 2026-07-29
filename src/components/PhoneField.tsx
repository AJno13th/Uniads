"use client";

import { useId, useState } from "react";
import {
  composeInternationalPhone,
  defaultPhoneCountryCode,
  phoneCountries,
} from "@/data/phone-countries";

type Props = {
  name?: string;
  required?: boolean;
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  selectClassName?: string;
  defaultCountry?: string;
  defaultNational?: string;
  id?: string;
};

/**
 * Country code + local number. Hidden field `name` stores full +E.164 phone.
 */
export function PhoneField({
  name = "phone",
  required = true,
  label = "Phone / WhatsApp",
  labelClassName = "label",
  inputClassName = "input",
  selectClassName = "input",
  defaultCountry = defaultPhoneCountryCode,
  defaultNational = "",
  id,
}: Props) {
  const autoId = useId();
  const fieldId = id ?? `phone-${autoId}`;
  const [country, setCountry] = useState(defaultCountry);
  const [national, setNational] = useState(defaultNational);

  const composed = composeInternationalPhone(country, national) ?? "";
  const example =
    phoneCountries.find((c) => c.code === country)?.example ?? "your mobile number";

  return (
    <div>
      {label ? (
        <label className={labelClassName} htmlFor={fieldId}>
          {label}
          {required ? " *" : ""}
        </label>
      ) : null}
      <div className="flex gap-2">
        <select
          aria-label="Country calling code"
          className={`${selectClassName} w-[9.5rem] shrink-0 sm:w-[11rem]`}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {phoneCountries.map((c) => (
            <option key={`${c.code}-${c.label}`} value={c.code}>
              {c.flag} +{c.code} · {c.label}
            </option>
          ))}
        </select>
        <input
          id={fieldId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          className={inputClassName}
          placeholder={example}
          value={national}
          onChange={(e) => setNational(e.target.value)}
          aria-label={label || "Phone number"}
        />
      </div>
      <input type="hidden" name={name} value={composed} />
      <input type="hidden" name={`${name}Country`} value={country} />
      <p className="mt-1.5 text-xs text-muted">
        Select your country code. We’ll save{" "}
        <span className="font-semibold text-navy">
          {composed || `+${country}…`}
        </span>{" "}
        so WhatsApp works worldwide.
      </p>
    </div>
  );
}

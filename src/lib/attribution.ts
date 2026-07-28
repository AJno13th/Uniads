/**
 * First-touch ad attribution for Facebook / TikTok / Google paid traffic.
 * Captures UTMs + click IDs from the landing URL and keeps them for the session
 * so apply / book / qualifier forms can attach them to CRM leads.
 */

export type Attribution = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  ttclid: string | null;
  gclid: string | null;
  landingPage: string | null;
  referrer: string | null;
};

const STORAGE_KEY = "uniads_attribution_v1";
const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "ttclid",
  "gclid",
] as const;

function emptyAttribution(): Attribution {
  return {
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    fbclid: null,
    ttclid: null,
    gclid: null,
    landingPage: null,
    referrer: null,
  };
}

function fromQuery(params: URLSearchParams, landingPage: string, referrer: string): Attribution {
  const get = (key: (typeof ATTR_KEYS)[number]) => {
    const value = params.get(key)?.trim();
    return value ? value.slice(0, 200) : null;
  };

  return {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmContent: get("utm_content"),
    utmTerm: get("utm_term"),
    fbclid: get("fbclid"),
    ttclid: get("ttclid"),
    gclid: get("gclid"),
    landingPage: landingPage.slice(0, 300) || null,
    referrer: referrer.slice(0, 300) || null,
  };
}

function hasAdSignal(attr: Attribution) {
  return Boolean(
    attr.utmSource ||
      attr.utmMedium ||
      attr.utmCampaign ||
      attr.utmContent ||
      attr.utmTerm ||
      attr.fbclid ||
      attr.ttclid ||
      attr.gclid
  );
}

/** Capture current URL attribution into sessionStorage (first-touch wins). */
export function captureAttributionFromLocation() {
  if (typeof window === "undefined") return;

  try {
    const params = new URLSearchParams(window.location.search);
    const incoming = fromQuery(
      params,
      `${window.location.pathname}${window.location.search}`,
      document.referrer || ""
    );

    if (!hasAdSignal(incoming) && !incoming.landingPage) return;

    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    if (existingRaw) {
      const existing = JSON.parse(existingRaw) as Attribution;
      if (hasAdSignal(existing)) return; // keep first touch
    }

    // Always record landing page on first visit with or without UTMs
    if (!hasAdSignal(incoming) && existingRaw) return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
  } catch {
    // sessionStorage may be blocked; ignore
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return emptyAttribution();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Fall back to current URL if capture hasn't run yet
      const params = new URLSearchParams(window.location.search);
      return fromQuery(
        params,
        `${window.location.pathname}${window.location.search}`,
        document.referrer || ""
      );
    }
    return { ...emptyAttribution(), ...(JSON.parse(raw) as Attribution) };
  } catch {
    return emptyAttribution();
  }
}

export function formatAttributionLine(attr: Partial<Attribution> | null | undefined) {
  if (!attr) return null;
  const parts = [
    attr.utmSource && `source=${attr.utmSource}`,
    attr.utmMedium && `medium=${attr.utmMedium}`,
    attr.utmCampaign && `campaign=${attr.utmCampaign}`,
    attr.utmContent && `content=${attr.utmContent}`,
    attr.utmTerm && `term=${attr.utmTerm}`,
    attr.fbclid && "fbclid=yes",
    attr.ttclid && "ttclid=yes",
    attr.gclid && "gclid=yes",
  ].filter(Boolean);
  if (parts.length === 0 && !attr.landingPage) return null;
  const line = parts.length ? parts.join(" · ") : null;
  if (attr.landingPage && line) return `${line} · page=${attr.landingPage}`;
  if (attr.landingPage) return `page=${attr.landingPage}`;
  return line;
}

/** Browser-side Lead event for Meta / TikTok pixels (no-op if pixels absent). */
export function trackLeadConversion(reference: string | null) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
  };
  try {
    w.fbq?.("track", "Lead", { content_name: reference ?? "uniads_lead" });
    w.ttq?.track("SubmitForm", { contents: [{ content_id: reference ?? "uniads_lead" }] });
  } catch {
    // ignore pixel errors
  }
}

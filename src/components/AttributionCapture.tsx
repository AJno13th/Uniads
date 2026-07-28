"use client";

import { useEffect } from "react";
import { captureAttributionFromLocation } from "@/lib/attribution";

/** Persists first-touch UTM / click IDs when a visitor lands from an ad. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttributionFromLocation();
  }, []);
  return null;
}

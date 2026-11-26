"use client";

import { useSyncExternalStore } from "react";

export function formatLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function subscribeFocus(callback: () => void) {
  window.addEventListener("focus", callback);
  return () => window.removeEventListener("focus", callback);
}

function getClientToday(): string {
  return formatLocalDateString(new Date());
}

function getServerToday(): string {
  // Evita leitura de data atual durante prerender estático no servidor (Next.js 16)
  return "";
}

export function useTodayDateString(): string {
  return useSyncExternalStore(subscribeFocus, getClientToday, getServerToday);
}

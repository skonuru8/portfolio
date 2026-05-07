"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);
}

function subscribeTouch(callback: () => void) {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getTouchSnapshot() {
  // Returns true when the device is touch-only (no fine hover pointer)
  return !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function useIsTouch(): boolean {
  return useSyncExternalStore(subscribeTouch, getTouchSnapshot, () => false);
}

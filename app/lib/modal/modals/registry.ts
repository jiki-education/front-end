import type { ComponentType } from "react";
import { coreModals } from "./core";

// Runtime modal registry. Core modals are registered eagerly; (app)-only
// modals are registered by AppModalRegistrar when an (app) route mounts.
// This lets non-(app) routes (blog, articles, landing, premium marketing)
// avoid bundling the (app) modal JS chunks.
const registry: Record<string, ComponentType<any>> = { ...coreModals };

export function registerModals(modals: Record<string, ComponentType<any>>): void {
  Object.assign(registry, modals);
}

export function getModal(name: string): ComponentType<any> | undefined {
  return registry[name];
}

import { useEffect, useRef } from "react";
import { keyboard } from "./index";
import type { KeyboardHandler, ShortcutOptions } from "./types";

export function useKeyboard(keys: string, handler: KeyboardHandler, options: ShortcutOptions = {}): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const wrapper = (event: KeyboardEvent) => handlerRef.current(event);
    const unsubscribe = keyboard.on(keys, wrapper, options);
    return unsubscribe;
    // we don't want to track the whole options object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, options.scope, options.enabled, options.preventDefault, options.stopPropagation]);
}

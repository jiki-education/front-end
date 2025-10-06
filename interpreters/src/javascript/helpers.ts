import type { Location } from "../shared/location";
import { JikiObject } from "./jikiObjects";

export function formatJSObject(value?: any): string {
  if (value === undefined) {
    return "";
  }

  if (value instanceof JikiObject) {
    return value.toString();
  }

  return JSON.stringify(value);
}

export function codeTag(code: string | JikiObject, location: Location): string {
  let parsedCode: string;
  if (code instanceof JikiObject) {
    parsedCode = code.toString();
  } else {
    parsedCode = code;
  }

  const from = location.absolute.begin;
  const to = location.absolute.end;
  return `<code data-hl-from="${from}" data-hl-to="${to}">${parsedCode}</code>`;
}

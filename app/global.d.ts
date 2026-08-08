import type messages from "./messages.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}

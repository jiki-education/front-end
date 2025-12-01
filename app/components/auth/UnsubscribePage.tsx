import { UnsubscribeContent } from "./UnsubscribeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe - Jiki",
  description: "Unsubscribe from Jiki emails"
};

export default function UnsubscribePage() {
  return <UnsubscribeContent />;
}

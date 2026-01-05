import TypingTestPanel from "@/components/coding-exercise/ui/TypingTestPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev: Typing Test - Jiki",
  description: "Development page for testing TypeIt.js typing animations."
};

export default function TypingTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <TypingTestPanel />
    </div>
  );
}

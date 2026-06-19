import {
  deriveUsageStatus,
  extractUsage,
  usageLimitText,
  usageWarningText
} from "@/components/coding-exercise/lib/chatUsage";
import type { SignatureData, UsageMeta } from "@/components/coding-exercise/lib/chat-types";

const baseSignature: SignatureData = {
  type: "signature",
  signature: "sig",
  timestamp: "2026-06-19T12:00:00.000Z",
  exerciseSlug: "test-exercise",
  userMessage: "hi"
};

function usage(overrides: Partial<UsageMeta> = {}): UsageMeta {
  return { messagesToday: 0, messagesThisMonth: 0, dailyLimit: 100, monthlyLimit: 500, ...overrides };
}

describe("chatUsage", () => {
  describe("extractUsage", () => {
    it("returns null for a null signature", () => {
      expect(extractUsage(null)).toBeNull();
    });

    it("returns null when usage fields are missing (older proxy)", () => {
      expect(extractUsage(baseSignature)).toBeNull();
    });

    it("extracts usage when all fields are present", () => {
      const signature: SignatureData = {
        ...baseSignature,
        messagesToday: 7,
        messagesThisMonth: 152,
        dailyLimit: 100,
        monthlyLimit: 500
      };
      expect(extractUsage(signature)).toEqual({
        messagesToday: 7,
        messagesThisMonth: 152,
        dailyLimit: 100,
        monthlyLimit: 500
      });
    });

    it("treats zero counts as present, not missing", () => {
      const signature: SignatureData = {
        ...baseSignature,
        messagesToday: 0,
        messagesThisMonth: 0,
        dailyLimit: 100,
        monthlyLimit: 500
      };
      expect(extractUsage(signature)).not.toBeNull();
    });
  });

  describe("deriveUsageStatus", () => {
    it("returns null when usage is null", () => {
      expect(deriveUsageStatus(null)).toBeNull();
    });

    it("treats daily as binding when it has fewer remaining", () => {
      const status = deriveUsageStatus(usage({ messagesToday: 50, messagesThisMonth: 100 }));
      expect(status).toMatchObject({ scope: "daily", used: 50, limit: 100, atCap: false, warning: false });
    });

    it("treats monthly as binding when it has fewer remaining", () => {
      // daily 10/100 (90 left) vs monthly 460/500 (40 left) -> monthly binds
      const status = deriveUsageStatus(usage({ messagesToday: 10, messagesThisMonth: 460 }));
      expect(status).toMatchObject({ scope: "monthly", used: 460, limit: 500, warning: true });
    });

    it("flags the warning band at 90% of the daily limit", () => {
      expect(deriveUsageStatus(usage({ messagesToday: 89 }))?.warning).toBe(false);
      expect(deriveUsageStatus(usage({ messagesToday: 90 }))?.warning).toBe(true);
    });

    it("flags the warning band at 90% of the monthly limit", () => {
      // Keep daily well clear so monthly is the binding scope.
      expect(deriveUsageStatus(usage({ messagesToday: 0, messagesThisMonth: 449 }))?.warning).toBe(false);
      expect(deriveUsageStatus(usage({ messagesToday: 0, messagesThisMonth: 450 }))?.warning).toBe(true);
    });

    it("reports atCap (and not warning) once the daily limit is reached", () => {
      const status = deriveUsageStatus(usage({ messagesToday: 100 }));
      expect(status).toMatchObject({ scope: "daily", atCap: true, warning: false });
    });

    it("prefers monthly scope when both limits are hit", () => {
      const status = deriveUsageStatus(usage({ messagesToday: 100, messagesThisMonth: 500 }));
      expect(status).toMatchObject({ scope: "monthly", atCap: true });
    });
  });

  describe("copy", () => {
    it("builds daily warning copy", () => {
      const status = deriveUsageStatus(usage({ messagesToday: 90 }))!;
      expect(usageWarningText(status)).toBe("You're getting close to your daily limit (90/100 messages today).");
    });

    it("builds monthly warning copy", () => {
      const status = deriveUsageStatus(usage({ messagesThisMonth: 450 }))!;
      expect(usageWarningText(status)).toBe(
        "You're getting close to your monthly limit (450/500 messages this month)."
      );
    });

    it("builds daily cap copy with the UTC reset", () => {
      expect(usageLimitText("daily", 100)).toBe("You've used all 100 of today's messages. They reset at midnight UTC.");
    });

    it("builds monthly cap copy with the 1st reset", () => {
      expect(usageLimitText("monthly", 500)).toBe("You've used all 500 messages this month. They reset on the 1st.");
    });
  });
});

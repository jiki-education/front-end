import { checkSeenFlag, clearSeenFlagLocal, setSeenFlag } from "@/lib/api/seen-flags";

jest.mock("@/lib/api/client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

import { api } from "@/lib/api/client";

const mockApi = api as jest.Mocked<typeof api>;

const KEY = "welcome_modal";
const STORAGE_KEY = `jiki_seen_flag_${KEY}`;

describe("seen-flags API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("checkSeenFlag", () => {
    it("returns true from localStorage without hitting the API", async () => {
      localStorage.setItem(STORAGE_KEY, "true");

      const result = await checkSeenFlag(KEY);

      expect(result).toBe(true);
      expect(mockApi.get).not.toHaveBeenCalled();
    });

    it("falls back to the API when localStorage is empty and caches a positive result", async () => {
      mockApi.get.mockResolvedValue({
        data: { seen: true },
        status: 200,
        headers: new Headers()
      });

      const result = await checkSeenFlag(KEY);

      expect(mockApi.get).toHaveBeenCalledWith(`/internal/settings/seen_flags/${KEY}`);
      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
    });

    it("returns false and does not cache when the API says unseen", async () => {
      mockApi.get.mockResolvedValue({
        data: { seen: false },
        status: 200,
        headers: new Headers()
      });

      const result = await checkSeenFlag(KEY);

      expect(result).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("returns false when the API request fails", async () => {
      mockApi.get.mockRejectedValue(new Error("network down"));

      const result = await checkSeenFlag(KEY);

      expect(result).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("setSeenFlag", () => {
    it("writes to localStorage and POSTs to the API", async () => {
      mockApi.post.mockResolvedValue({
        data: { seen: true },
        status: 200,
        headers: new Headers()
      });

      await setSeenFlag(KEY);

      expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
      expect(mockApi.post).toHaveBeenCalledWith(`/internal/settings/seen_flags/${KEY}`);
    });
  });

  describe("clearSeenFlagLocal", () => {
    it("removes the localStorage entry", () => {
      localStorage.setItem(STORAGE_KEY, "true");

      clearSeenFlagLocal(KEY);

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});

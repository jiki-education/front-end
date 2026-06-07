import { checkFlag, clearFlagLocal, setFlag } from "@/lib/api/flags";

jest.mock("@/lib/api/client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

import { api } from "@/lib/api/client";

const mockApi = api as jest.Mocked<typeof api>;

const KEY = "welcome_modal";
const STORAGE_KEY = `jiki_flag_${KEY}`;

describe("flags API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("checkFlag", () => {
    it("returns true from localStorage without hitting the API", async () => {
      localStorage.setItem(STORAGE_KEY, "true");

      const result = await checkFlag(KEY);

      expect(result).toBe(true);
      expect(mockApi.get).not.toHaveBeenCalled();
    });

    it("falls back to the API when localStorage is empty and caches a positive result", async () => {
      mockApi.get.mockResolvedValue({
        data: { flagged: true },
        status: 200,
        headers: new Headers()
      });

      const result = await checkFlag(KEY);

      expect(mockApi.get).toHaveBeenCalledWith(`/internal/settings/flags/${KEY}`);
      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
    });

    it("returns false and does not cache when the API says unflagged", async () => {
      mockApi.get.mockResolvedValue({
        data: { flagged: false },
        status: 200,
        headers: new Headers()
      });

      const result = await checkFlag(KEY);

      expect(result).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("returns false when the API request fails", async () => {
      mockApi.get.mockRejectedValue(new Error("network down"));

      const result = await checkFlag(KEY);

      expect(result).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("setFlag", () => {
    it("writes to localStorage and POSTs to the API", async () => {
      mockApi.post.mockResolvedValue({
        data: {},
        status: 200,
        headers: new Headers()
      });

      await setFlag(KEY);

      expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
      expect(mockApi.post).toHaveBeenCalledWith(`/internal/settings/flags/${KEY}`);
    });
  });

  describe("clearFlagLocal", () => {
    it("removes the localStorage entry", () => {
      localStorage.setItem(STORAGE_KEY, "true");

      clearFlagLocal(KEY);

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});

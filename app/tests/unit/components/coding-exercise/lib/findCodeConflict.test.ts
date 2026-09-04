import { findCodeConflict } from "@/components/coding-exercise/lib/findCodeConflict";
import { loadCodeMirrorContent } from "@/components/coding-exercise/lib/localStorage";

jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn()
}));

const mockLoad = loadCodeMirrorContent as jest.Mock;

function stubLocal(code: string, storedAt: string) {
  mockLoad.mockReturnValue({ success: true, data: { code, storedAt } });
}

const T0 = "2026-09-01T10:00:00.000Z";
const T0_PLUS_2_MIN = "2026-09-01T10:02:00.000Z";
const T0_PLUS_30_SEC = "2026-09-01T10:00:30.000Z";

describe("findCodeConflict", () => {
  beforeEach(() => {
    mockLoad.mockReset();
  });

  it("returns null without server data", () => {
    stubLocal("local", T0);
    expect(findCodeConflict("slug", undefined)).toBeNull();
  });

  it("returns null when the server data has no timestamp", () => {
    stubLocal("local", T0);
    expect(findCodeConflict("slug", { code: "server" })).toBeNull();
  });

  it("returns null without local storage", () => {
    mockLoad.mockReturnValue({ success: false });
    expect(findCodeConflict("slug", { code: "server", createdAt: T0_PLUS_2_MIN })).toBeNull();
  });

  it("returns null when both versions are identical", () => {
    stubLocal("same", T0);
    expect(findCodeConflict("slug", { code: "same", createdAt: T0_PLUS_2_MIN })).toBeNull();
  });

  it("returns null when the server version is older", () => {
    stubLocal("local", T0_PLUS_2_MIN);
    expect(findCodeConflict("slug", { code: "server", createdAt: T0 })).toBeNull();
  });

  it("returns null when the server version is newer by less than a minute", () => {
    stubLocal("local", T0);
    expect(findCodeConflict("slug", { code: "server", createdAt: T0_PLUS_30_SEC })).toBeNull();
  });

  it("returns null when a timestamp is invalid", () => {
    stubLocal("local", "not-a-date");
    expect(findCodeConflict("slug", { code: "server", createdAt: T0_PLUS_2_MIN })).toBeNull();
  });

  it("returns both versions when the server holds meaningfully newer, different code", () => {
    stubLocal("local", T0);
    expect(findCodeConflict("slug", { code: "server", createdAt: T0_PLUS_2_MIN })).toEqual({
      localCode: "local",
      serverCode: "server"
    });
  });
});

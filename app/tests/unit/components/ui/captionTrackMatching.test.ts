import { findTrackForLocale, type CaptionTrack } from "@/components/ui/captionTrackMatching";

function track(overrides: Partial<CaptionTrack>): CaptionTrack {
  return { id: "t", kind: "subtitles", label: "", language: "", mode: "disabled", ...overrides };
}

describe("findTrackForLocale", () => {
  it("matches a track whose language equals the locale", () => {
    const hu = track({ id: "hu", language: "hu" });
    const tracks = [track({ id: "en", language: "en" }), hu];

    expect(findTrackForLocale(tracks, "hu")).toBe(hu);
  });

  it("returns null when no track is in the reader's language", () => {
    const tracks = [track({ id: "en", language: "en" })];

    // No English fallback: captions they may not read are worse than none.
    expect(findTrackForLocale(tracks, "hu")).toBeNull();
  });

  it("returns null when there are no tracks at all", () => {
    expect(findTrackForLocale([], "hu")).toBeNull();
  });

  it("ignores non-caption tracks like chapters and thumbnail metadata", () => {
    const tracks = [
      track({ id: "chapters", kind: "chapters", language: "hu" }),
      track({ id: "thumbs", kind: "metadata", label: "thumbnails", language: "hu" })
    ];

    expect(findTrackForLocale(tracks, "hu")).toBeNull();
  });

  it("selects a captions track as readily as a subtitles one", () => {
    const captions = track({ id: "hu-cc", kind: "captions", language: "hu" });

    expect(findTrackForLocale([captions], "hu")).toBe(captions);
  });

  it("matches case-insensitively, since Mux track languages are uploader-written", () => {
    const hu = track({ id: "hu", language: "HU" });

    expect(findTrackForLocale([hu], "hu")).toBe(hu);
  });

  it("matches a regional track for a bare locale", () => {
    const ptBr = track({ id: "pt-br", language: "pt-BR" });

    expect(findTrackForLocale([ptBr], "pt")).toBe(ptBr);
  });

  it("matches a generic track for a regional locale", () => {
    const pt = track({ id: "pt", language: "pt" });

    expect(findTrackForLocale([pt], "pt-BR")).toBe(pt);
  });

  it("prefers an exact regional match over a generic one", () => {
    const generic = track({ id: "pt", language: "pt" });
    const brazilian = track({ id: "pt-br", language: "pt-BR" });

    // Generic is first in order, so this fails if it were first-match-wins.
    expect(findTrackForLocale([generic, brazilian], "pt-BR")).toBe(brazilian);
  });

  it("tolerates tracks with no language rather than matching them", () => {
    const unlabelled = track({ id: "x", language: undefined });

    expect(findTrackForLocale([unlabelled], "hu")).toBeNull();
  });

  it("returns null for an empty locale", () => {
    expect(findTrackForLocale([track({ id: "hu", language: "hu" })], "")).toBeNull();
  });
});

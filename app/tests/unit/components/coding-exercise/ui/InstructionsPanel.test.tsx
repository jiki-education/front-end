import { render, waitFor } from "@testing-library/react";
import InstructionsPanel from "@/components/coding-exercise/ui/instructions-panel/InstructionsPanel";
import { getConceptsBySlugs } from "@/lib/api/concepts";

jest.mock("@/lib/api/concepts");

// The global next-intl mock (jest.setup.js) pins the locale to "en", which cannot
// tell a passed-through locale from a dropped one. Swap in a settable locale.
let mockLocale = "en";
jest.mock("next-intl", () => ({
  useLocale: () => mockLocale,
  useTranslations: () => {
    const t = (key: string) => key;
    t.rich = (key: string) => key;
    return t;
  }
}));

const mockGetConceptsBySlugs = getConceptsBySlugs as jest.MockedFunction<typeof getConceptsBySlugs>;

function renderPanel() {
  return render(
    <InstructionsPanel
      instructions="Do the thing"
      functions={[]}
      conceptSlugs={["variables"]}
      exerciseTitle="Sprouting Flower"
      exerciseSlug="sprouting-flower"
      levelId="basics"
    />
  );
}

describe("InstructionsPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetConceptsBySlugs.mockResolvedValue([]);
  });

  afterEach(() => {
    mockLocale = "en";
  });

  // The concept cards inside the panel must be fetched in the locale the rest of
  // the panel renders in; dropping the argument used to silently serve English.
  it("fetches concepts in the active locale", async () => {
    mockLocale = "uk";

    renderPanel();

    await waitFor(() => {
      expect(mockGetConceptsBySlugs).toHaveBeenCalledWith(["variables"], "uk");
    });
  });

  it("fetches concepts in English when English is active", async () => {
    mockLocale = "en";

    renderPanel();

    await waitFor(() => {
      expect(mockGetConceptsBySlugs).toHaveBeenCalledWith(["variables"], "en");
    });
  });
});

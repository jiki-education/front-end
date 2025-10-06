import { hideModal, showConfirmation, showInfo, showModal, useModalStore } from "@/lib/modal/store";

describe("Modal Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useModalStore.setState({
      isOpen: false,
      modalName: null,
      modalProps: {}
    });
  });

  describe("showModal", () => {
    it("should open a modal with the specified name and props", () => {
      showModal("test-modal", { title: "Test", message: "Hello" });

      const state = useModalStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.modalName).toBe("test-modal");
      expect(state.modalProps).toEqual({ title: "Test", message: "Hello" });
    });

    it("should open a modal with default empty props if none provided", () => {
      showModal("test-modal");

      const state = useModalStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.modalName).toBe("test-modal");
      expect(state.modalProps).toEqual({});
    });
  });

  describe("hideModal", () => {
    it("should close the modal and reset state", () => {
      // First open a modal
      showModal("test-modal", { prop: "value" });
      expect(useModalStore.getState().isOpen).toBe(true);

      // Then hide it
      hideModal();

      const state = useModalStore.getState();
      expect(state.isOpen).toBe(false);
      expect(state.modalName).toBe(null);
      expect(state.modalProps).toEqual({});
    });
  });

  describe("showConfirmation", () => {
    it("should open confirmation modal with provided props", () => {
      const confirmProps = {
        title: "Delete?",
        message: "Are you sure?",
        onConfirm: jest.fn(),
        variant: "danger" as const
      };

      showConfirmation(confirmProps);

      const state = useModalStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.modalName).toBe("confirmation-modal");
      expect(state.modalProps).toEqual(confirmProps);
    });
  });

  describe("showInfo", () => {
    it("should open info modal with provided props", () => {
      const infoProps = {
        title: "Information",
        content: "This is some info",
        buttonText: "OK"
      };

      showInfo(infoProps);

      const state = useModalStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.modalName).toBe("info-modal");
      expect(state.modalProps).toEqual(infoProps);
    });
  });

  describe("store actions", () => {
    it("should replace current modal when opening a new one", () => {
      // Open first modal
      showModal("modal-1", { prop: "first" });
      expect(useModalStore.getState().modalName).toBe("modal-1");

      // Open second modal (should replace first)
      showModal("modal-2", { prop: "second" });

      const state = useModalStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.modalName).toBe("modal-2");
      expect(state.modalProps).toEqual({ prop: "second" });
    });
  });

  describe("useModalStore hook", () => {
    it("should provide access to state and actions", () => {
      const state = useModalStore.getState();

      // Test that actions are available
      expect(typeof state.showModal).toBe("function");
      expect(typeof state.hideModal).toBe("function");

      // Test that state properties exist
      expect("isOpen" in state).toBe(true);
      expect("modalName" in state).toBe(true);
      expect("modalProps" in state).toBe(true);
    });
  });
});

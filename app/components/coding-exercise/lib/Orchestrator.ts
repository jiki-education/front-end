// This is an orchestration class for the whole page.
// When the page loads, this is created and then is the thing that's
// passed around, controls the state, etc.

import type { EditorView } from "@codemirror/view";
import type { Frame } from "@jiki/interpreters/shared";
import type { ExerciseDefinition, Language, ReadonlyRange } from "@jiki/curriculum";
import { getLanguageFeatures } from "@jiki/curriculum";
import { debounce } from "lodash";
import type { StoreApi } from "zustand/vanilla";
import { EditorManager } from "./orchestrator/EditorManager";
import { loadCodeMirrorContent } from "./localStorage";
import { createOrchestratorStore } from "./orchestrator/store";
import { TaskManager } from "./orchestrator/TaskManager";
import { TestSuiteManager } from "./orchestrator/TestSuiteManager";
import { TimelineManager } from "./orchestrator/TimelineManager";
import { getInterpreter } from "./test-runner/getInterpreter";
import type { TestExpect, TestResult } from "./test-results-types";
import type { ExerciseContext, InformationWidgetData, OrchestratorStore, UnderlineRange } from "./types";

class Orchestrator {
  readonly store: StoreApi<OrchestratorStore>; // Made readonly instead of private for methods to access
  private readonly timelineManager: TimelineManager;
  private readonly testSuiteManager: TestSuiteManager;
  private readonly taskManager: TaskManager;
  private editorManager: EditorManager | null = null;
  private editorRefCallback: ((element: HTMLDivElement | null) => void) | null = null;
  exercise: ExerciseDefinition;
  private readonly language: Language;
  readonly contentHash: string;

  constructor(
    exercise: ExerciseDefinition,
    language: Language,
    context: ExerciseContext,
    contentHash: string = "",
    onGoToDashboard?: () => void,
    serverData?: { code: string; storedAt?: string }
  ) {
    this.exercise = exercise;
    this.language = language;
    this.contentHash = contentHash;

    // Create instance-specific store with exercise, language, and context
    this.store = createOrchestratorStore(exercise, language, context, onGoToDashboard);

    // Initialize managers
    this.timelineManager = new TimelineManager(this.store);
    this.taskManager = new TaskManager(this.store);
    this.testSuiteManager = new TestSuiteManager(this.store, this.taskManager, context);
    // EditorManager will be created lazily when setupEditor is called

    // Initialize exercise data — merges the server's last submission (if any)
    // with localStorage, falling back to the stub.
    this.store.getState().initializeExerciseData(serverData);

    // Initialize task progress
    this.taskManager.initializeTaskProgress(exercise);
  }

  // Expose the store so a hook can use it
  getStore() {
    return this.store;
  }

  // Setup the editor - returns a stable ref callback that manages EditorManager lifecycle
  setupEditor() {
    // Create ref callback only once to ensure stability across renders
    // React requires ref callbacks to be stable to avoid unnecessary re-runs
    if (!this.editorRefCallback) {
      this.editorRefCallback = (element: HTMLDivElement | null) => {
        // Always clean up existing EditorManager first
        if (this.editorManager) {
          this.editorManager.cleanup();
          this.editorManager = null;
        }

        // Create new EditorManager if element is provided
        if (element) {
          this.editorManager = new EditorManager(
            element,
            this.store,
            this.exercise.slug,
            this.store.getState().code,
            this.getStoredOrDefaultReadonlyRanges(),
            this.runCode.bind(this),
            (code: string) => this.lintCodeDebounced(code)
          );
        }
      };
    }
    return this.editorRefCallback;
  }

  // Get the editor view - primarily for testing purposes
  // Production code should use the orchestrator's methods instead of direct view access
  getEditorView(): EditorView | null {
    return this.editorManager?.editorView ?? null;
  }

  getCurrentEditorValue(): string | undefined {
    return this.editorManager?.getCurrentEditorValue();
  }

  // Public methods that use the store actions
  setCode(code: string) {
    this.store.getState().setCode(code);
  }

  setCurrentTest(test: TestResult | null) {
    this.store.getState().setCurrentTest(test);
  }

  setCurrentTestIdx(idx: number) {
    this.store.getState().setCurrentTestIdx(idx);
  }

  /*
    This method is specifically for when we want to set a specific time.
    It's not for side-effects (e.g. when the animation is playing and we
    are syncing the time).
  */
  setCurrentTestTime(time: number, nearestOrExactFrame: "nearest" | "exact" = "exact") {
    this.store.getState().setCurrentTestTime(time, nearestOrExactFrame);

    // Also seek to the relevant spot on the animation timeline if it exists (visual tests only)
    // This is what powers the stepper buttons. We want to mute callbacks as we don't want the
    // microsecond to ms conversion changing the currentTestTime value we've just set and losing precision.
    this.store.getState().currentTest?.animationTimeline?.seek(time, true);
  }

  setFoldedLines(lines: number[]) {
    // When folded lines change, recalculate the current frame
    const state = this.store.getState();

    // Set folded lines first
    state.setFoldedLines(lines);

    // Then recalculate the frame with the new folded lines
    // We don't want to update the animation itself, so we just
    // update the store manually.
    // Use force=true to ensure recalculation even if time hasn't changed
    if (state.currentTest) {
      state.setCurrentTestTime(state.currentTestTime, "nearest", true);
    }
  }

  setReadonly(readonly: boolean) {
    this.store.getState().setReadonly(readonly);
  }

  setShouldShowInformationWidget(show: boolean) {
    this.store.getState().setShouldShowInformationWidget(show);
  }

  showInformationWidget() {
    this.editorManager?.showInformationWidget();
  }

  hideInformationWidget() {
    this.editorManager?.hideInformationWidget();
  }

  setUnderlineRange(range: UnderlineRange | undefined) {
    this.store.getState().setUnderlineRange(range);
  }

  setHighlightedLineColor(color: string) {
    this.store.getState().setHighlightedLineColor(color);
  }

  setHighlightedLine(line: number) {
    this.store.getState().setHighlightedLine(line);
  }

  setMultiLineHighlight(fromLine: number, toLine: number) {
    this.editorManager?.setMultiLineHighlight(fromLine, toLine);
  }

  setMultipleLineHighlights(lines: number[]) {
    this.editorManager?.setMultipleLineHighlights(lines);
  }

  setInformationWidgetData(data: InformationWidgetData) {
    this.store.getState().setInformationWidgetData(data);
  }

  setBreakpoints(breakpoints: number[]) {
    this.store.getState().setBreakpoints(breakpoints);
    this.editorManager?.applyBreakpoints(breakpoints);
  }

  setShouldAutoRunCode(shouldAutoRun: boolean) {
    this.store.getState().setShouldAutoRunCode(shouldAutoRun);
  }

  setIsExerciseCompleted(completed: boolean) {
    this.store.getState().setIsExerciseCompleted(completed);
  }

  // Play/pause methods
  play() {
    const state = this.store.getState();
    if (!state.currentTest) {
      return;
    }

    // If animation completed, reset to beginning (visual tests only)
    // Use orchestrator's setCurrentTestTime which also seeks the animation timeline
    if (state.currentTest.animationTimeline?.completed) {
      this.setCurrentTestTime(0);
    }

    // Set isPlaying state (this will handle animation.play() and hide widget)
    state.setIsPlaying(true);
  }

  pause() {
    const state = this.store.getState();
    if (!state.currentTest) {
      return;
    }

    // Set isPlaying state (this also pauses the animation timeline)
    state.setIsPlaying(false);

    // Disable auto-play when user manually pauses
    state.setShouldPlayOnTestChange(false);

    // Snap to nearest frame after pausing
    this.snapToNearestFrame();
  }

  // Snap to the nearest frame - delegate to TimelineManager
  snapToNearestFrame() {
    this.timelineManager.snapToNearestFrame();
  }

  getNearestCurrentFrame() {
    return this.timelineManager.getNearestCurrentFrame();
  }

  // Frame navigation methods
  goToPrevFrame() {
    this.moveToFrame(this.store.getState().prevFrame);
  }

  goToNextFrame() {
    this.moveToFrame(this.store.getState().nextFrame);
  }

  goToFirstFrame() {
    const frames = this.store.getState().currentTest?.frames ?? [];
    this.moveToFrame(frames[0]);
  }

  goToLastFrame() {
    const frames = this.store.getState().currentTest?.frames ?? [];
    this.moveToFrame(frames[frames.length - 1]);
  }

  // Breakpoint navigation methods
  goToPrevBreakpoint() {
    this.moveToFrame(this.store.getState().prevBreakpointFrame);
  }

  goToNextBreakpoint() {
    this.moveToFrame(this.store.getState().nextBreakpointFrame);
  }

  // Shared navigation behaviour for every stepper (frame + breakpoint) and the
  // scrubber keyboard shortcuts: pause playback, jump to the frame, and surface
  // the information widget so they all behave identically.
  private moveToFrame(frame: Frame | undefined) {
    this.pause();
    if (frame) {
      this.setCurrentTestTime(frame.time);
    }
    this.showInformationWidget();
  }

  private readonly lintCodeDebounced = debounce((code: string) => {
    void this.lintCode(code);
  }, 500);

  async lintCode(code: string) {
    try {
      const interpreter = await getInterpreter(this.language);
      const levelFeatures = getLanguageFeatures(this.exercise.levelId, this.language);
      const languageFeatures = {
        timePerFrame: 1,
        ...levelFeatures,
        ...this.exercise.interpreterOptions
      };

      let availableFunctions: Array<{ name: string; func: any; description: string }>;
      if (this.exercise.type === "visual") {
        const tempExercise = new this.exercise.ExerciseClass();
        availableFunctions = tempExercise.getExternalFunctions(this.language);
      } else {
        availableFunctions = this.exercise.ExerciseClass.getExternalFunctions(this.language);
      }

      const result = interpreter.compile(code, {
        externalFunctions: availableFunctions,
        languageFeatures
      });
      this.store.getState().setLintErrors(result.lintErrors);
    } catch {
      // Silently ignore lint errors (e.g. if interpreter fails to load)
    }
  }

  async runCode() {
    // Get the current code from the editor
    const currentCode = this.getCurrentEditorValue() || this.store.getState().code;

    // Delegate to TestSuiteManager with exercise definition
    // This automatically plays the first scenario.
    await this.testSuiteManager.runCode(currentCode, this.exercise);
  }

  // Expose exercise data for UI
  getExerciseTitle() {
    return this.exercise.title;
  }

  getExerciseInstructions() {
    return this.exercise.instructions;
  }

  getExercise() {
    return this.exercise;
  }

  isChallenge(): boolean {
    return this.store.getState().context.type === "challenge";
  }

  // Test result processing methods - delegate to TestSuiteManager
  getFirstExpect(): TestExpect | null {
    return this.testSuiteManager.getFirstExpect();
  }

  setCurrentTask(taskId: string): void {
    this.taskManager.setCurrentTask(taskId);
  }

  resetExercise(): void {
    // Reset store state to initial values
    this.store.getState().reset();

    // Re-initialize task progress
    this.taskManager.initializeTaskProgress(this.exercise);

    // Replace editor content with stub code
    this.editorManager?.resetContent(this.getStubCode(), this.getDefaultReadonlyRanges());
  }

  getStubCode(): string {
    return this.exercise.stubs[this.language];
  }

  getDefaultReadonlyRanges(): ReadonlyRange[] {
    return this.exercise.readonlyRanges?.[this.language] ?? [];
  }

  // Returns the readonly ranges to apply when the editor mounts.
  //
  // The exercise's default ranges are defined against the *stub's* line
  // numbers, so they are only correct while the editor still holds the stub.
  // Once a snapshot is saved to localStorage the code may be student-edited,
  // and the stored ranges are the only ones that have been mapped through those
  // edits. Applying stub-relative defaults on top of edited code would risk
  // locking lines the student wrote, so:
  //   - no saved snapshot  -> pristine stub, use the exercise defaults
  //   - saved snapshot     -> use its ranges, or no locks if they are
  //                           missing/malformed (never guess with defaults)
  // Malformed entries (from a corrupted or older-version payload) are rejected
  // so they can't crash CodeMirror's doc.line() at editor mount.
  getStoredOrDefaultReadonlyRanges(): ReadonlyRange[] {
    const stored = loadCodeMirrorContent(this.exercise.slug);
    if (!stored.success) {
      return this.getDefaultReadonlyRanges();
    }
    const raw = stored.data?.readonlyRanges;
    if (Array.isArray(raw) && raw.every(isValidReadonlyRange)) {
      return raw;
    }
    return [];
  }

  // Clean up method to destroy the orchestrator and its managers
  destroy(): void {
    // Cancel any pending debounced lint
    this.lintCodeDebounced.cancel();

    // Clean up the editor manager if it exists
    if (this.editorManager) {
      this.editorManager.cleanup();
      this.editorManager = null;
    }

    // Clean up animation timeline if current test has one
    const currentTest = this.store.getState().currentTest;
    if (currentTest?.animationTimeline) {
      currentTest.animationTimeline.destroy();
    }

    // Clear any callbacks
    this.editorRefCallback = null;
  }
}

function isValidReadonlyRange(value: unknown): value is ReadonlyRange {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const r = value as Record<string, unknown>;
  if (!Number.isInteger(r.fromLine) || (r.fromLine as number) < 1) {
    return false;
  }
  if (!Number.isInteger(r.toLine) || (r.toLine as number) < (r.fromLine as number)) {
    return false;
  }
  if (r.fromChar !== undefined && (!Number.isInteger(r.fromChar) || (r.fromChar as number) < 0)) {
    return false;
  }
  if (r.toChar !== undefined && (!Number.isInteger(r.toChar) || (r.toChar as number) < 0)) {
    return false;
  }
  return true;
}

// Re-export the hook from store.ts
export { useOrchestratorStore } from "./orchestrator/store";
export type { Orchestrator };

export default Orchestrator;

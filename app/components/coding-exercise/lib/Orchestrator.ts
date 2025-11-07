// This is an orchestration class for the whole page.
// When the page loads, this is created and then is the thing that's
// passed around, controls the state, etc.

import type { EditorView } from "@codemirror/view";
import type { ExerciseDefinition, Language } from "@jiki/curriculum";
import type { StoreApi } from "zustand/vanilla";
import { BreakpointManager } from "./orchestrator/BreakpointManager";
import { EditorManager } from "./orchestrator/EditorManager";
import { createOrchestratorStore } from "./orchestrator/store";
import { TaskManager } from "./orchestrator/TaskManager";
import { TestSuiteManager } from "./orchestrator/TestSuiteManager";
import { TimelineManager } from "./orchestrator/TimelineManager";
import type { TestExpect, TestResult } from "./test-results-types";
import type { ExerciseContext, InformationWidgetData, OrchestratorStore, UnderlineRange } from "./types";

class Orchestrator {
  readonly store: StoreApi<OrchestratorStore>; // Made readonly instead of private for methods to access
  private readonly timelineManager: TimelineManager;
  private readonly breakpointManager: BreakpointManager;
  private readonly testSuiteManager: TestSuiteManager;
  private readonly taskManager: TaskManager;
  private editorManager: EditorManager | null = null;
  private editorRefCallback: ((element: HTMLDivElement | null) => void) | null = null;
  exercise: ExerciseDefinition;

  constructor(exercise: ExerciseDefinition, language: Language, context?: ExerciseContext) {
    this.exercise = exercise;

    // Create instance-specific store with exercise and language
    this.store = createOrchestratorStore(exercise, language);

    // Initialize managers
    this.timelineManager = new TimelineManager(this.store);
    this.breakpointManager = new BreakpointManager(this.store);
    this.taskManager = new TaskManager(this.store);
    this.testSuiteManager = new TestSuiteManager(this.store, this.taskManager, context);
    // EditorManager will be created lazily when setupEditor is called

    // Initialize exercise data (loads from localStorage if available)
    this.store.getState().initializeExerciseData();

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
          this.editorManager = new EditorManager(element, this.store, this.exercise.slug, this.runCode.bind(this));
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

  // UNUSED: This function is currently not called.
  callOnEditorChangeCallback(view: EditorView) {
    this.editorManager?.callOnEditorChangeCallback(view);
  }

  // Auto-save the current editor content - delegate to EditorManager
  // UNUSED: This function is currently not called.
  autoSaveContent(code: string, readonlyRanges?: { from: number; to: number }[]) {
    this.editorManager?.autoSaveContent(code, readonlyRanges);
  }

  // UNUSED: This function is currently not called.
  saveImmediately(code: string, readonlyRanges?: { from: number; to: number }[]) {
    this.editorManager?.saveImmediately(code, readonlyRanges);
  }

  // UNUSED: This function is currently not called.
  getCurrentEditorValue(): string | undefined {
    return this.editorManager?.getCurrentEditorValue();
  }

  // Public methods that use the store actions
  setCode(code: string) {
    this.store.getState().setCode(code);
  }

  setExerciseTitle(title: string) {
    this.store.getState().setExerciseTitle(title);
  }

  setCurrentTest(test: TestResult | null) {
    this.store.getState().setCurrentTest(test);
  }

  /*
    This method is specifically for when we want to set a specific time.
    It's not for side-effects (e.g. when the animation is playing and we
    are syncing the time).
  */
  setCurrentTestTime(time: number) {
    this.store.getState().setCurrentTestTime(time);

    // Also seek to the relevant spot on the animation timeline if it exists (visual tests only)
    // This is what powers the stepper buttons.
    this.store.getState().currentTest?.animationTimeline?.seek(time);
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

  // Editor store public methods
  // UNUSED: This function is currently not called.
  setDefaultCode(code: string) {
    this.store.getState().setDefaultCode(code);
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

  // Error store public methods
  // UNUSED: This function is currently not called.
  setHasUnhandledError(hasError: boolean) {
    this.store.getState().setHasUnhandledError(hasError);
  }

  // UNUSED: This function is currently not called.
  setUnhandledErrorBase64(errorData: string) {
    this.store.getState().setUnhandledErrorBase64(errorData);
  }

  // Delegate frame methods to TimelineManager
  getNearestCurrentFrame() {
    return this.timelineManager.getNearestCurrentFrame();
  }

  // Breakpoint navigation methods - delegate to BreakpointManager
  goToPrevBreakpoint() {
    this.breakpointManager.goToPrevBreakpoint();
  }

  goToNextBreakpoint() {
    this.breakpointManager.goToNextBreakpoint();
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

  // Initialize editor with code, exercise data, and localStorage synchronization - delegate to EditorManager
  // UNUSED: This function is currently not called.
  initializeEditor(
    code: { storedAt?: string; code: string; readonlyRanges?: { from: number; to: number }[] },
    exercise: unknown,
    unfoldableFunctionNames: string[]
  ) {
    this.editorManager?.initializeEditor(code, exercise, unfoldableFunctionNames);
  }

  // Reset editor to stub code and save to localStorage - delegate to EditorManager
  // Initialize exercise data with localStorage/server priority logic
  initializeExerciseData(serverData?: {
    code: string;
    storedAt?: string;
    readonlyRanges?: { from: number; to: number }[];
  }) {
    this.store.getState().initializeExerciseData(serverData);
  }

  // UNUSED: This function is currently not called.
  resetEditorToStub(
    stubCode: string,
    defaultReadonlyRanges: { from: number; to: number }[],
    unfoldableFunctionNames: string[]
  ) {
    this.editorManager?.resetEditorToStub(stubCode, defaultReadonlyRanges, unfoldableFunctionNames);
  }

  // Test result processing methods - delegate to TestSuiteManager
  getFirstExpect(): TestExpect | null {
    return this.testSuiteManager.getFirstExpect();
  }

  // Task management methods - delegate to TaskManager
  getTaskCompletionStatus(taskId: string): "not-started" | "in-progress" | "completed" {
    return this.taskManager.getTaskCompletionStatus(taskId);
  }

  getTaskProgress(taskId: string) {
    return this.taskManager.getTaskProgress(taskId);
  }

  isTaskCompleted(taskId: string): boolean {
    return this.taskManager.isTaskCompleted(taskId);
  }

  getCompletedTaskIds(): string[] {
    return this.taskManager.getCompletedTaskIds();
  }

  setCurrentTask(taskId: string): void {
    this.taskManager.setCurrentTask(taskId);
  }
}

// Re-export the hook from store.ts
export { useOrchestratorStore } from "./orchestrator/store";
export type { Orchestrator };

export default Orchestrator;

import { createTranslator, type Messages, type ExerciseCore } from "@jiki/curriculum";

interface Keyed {
  name: string;
  description?: string;
}

interface HintLike {
  question: string;
  answer: string;
}

/**
 * Resolve an exercise's static, display-facing strings against its fetched
 * per-locale message dict.
 *
 * The curriculum keys its static display strings (task/scenario name+description,
 * hint question+answer, function description+category) so they can be resolved
 * against the same single-locale dict that drives runtime `errorHtml`/`logicError`.
 * This helper builds a translator from that dict (via `createTranslator`, exported
 * from the curriculum) and returns a shallow-cloned definition with those fields
 * resolved. All other fields — crucially scenario `setup`/`expectations` functions —
 * pass through untouched.
 *
 * Fields that are not keys (not-yet-migrated exercises) pass through unchanged,
 * because i18next returns the key on a miss. So this is safe to run over every
 * exercise, migrated or not.
 */
export function localizeExerciseDefinition<T extends ExerciseCore>(definition: T, dict: Messages): T {
  const t = createTranslator(dict);

  const localizeHints = (hints: readonly HintLike[] | undefined) =>
    hints?.map((hint) => ({ ...hint, question: t(hint.question), answer: t(hint.answer) }));

  const tasks = definition.tasks.map((task) => ({
    ...task,
    name: t(task.name),
    description: task.description === undefined ? task.description : t(task.description),
    hints: localizeHints(task.hints)
  }));

  const scenarios = (definition.scenarios as Keyed[]).map((scenario) => ({
    ...scenario,
    name: t(scenario.name),
    description: scenario.description === undefined ? scenario.description : t(scenario.description)
  }));

  const functions = definition.functions.map((fn) => ({
    ...fn,
    description: t(fn.description),
    category: t(fn.category)
  }));

  return {
    ...definition,
    tasks,
    scenarios,
    functions,
    hints: localizeHints(definition.hints)
  };
}

"use client";

import { showLessonSaveErrorToast } from "@/lib/toasts/lessonSaveError";

export default function LessonSaveToastPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-32">
        <h1 className="text-3xl font-bold mb-8">Lesson Save Error Toast</h1>
        <p className="text-gray-600 mb-24">
          Preview of the toast shown when a lesson&rsquo;s progress fails to save (e.g. a 422 from the
          <code className="mx-4">/complete</code> endpoint).
        </p>
        <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-red" onClick={() => showLessonSaveErrorToast()}>
          Show toast
        </button>
      </div>
    </div>
  );
}

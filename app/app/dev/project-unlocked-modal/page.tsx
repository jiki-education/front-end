"use client";

import { showModal } from "@/lib/modal";

const SAMPLE_PROJECTS = [
  {
    name: "Space Invaders",
    description: "Build a classic arcade game with aliens, lasers, and defensive barriers.",
    slug: "space-invaders"
  },
  {
    name: "Todo App",
    description: "Create a full-featured task manager with filtering, priorities, and persistence.",
    slug: "todo-app"
  },
  {
    name: "Weather Dashboard",
    description: "Fetch and display live weather data with charts and forecasts.",
    slug: "weather-dashboard"
  }
];

export default function ProjectUnlockedModalDevPage() {
  const trigger = (project: (typeof SAMPLE_PROJECTS)[number]) => {
    showModal("exercise-completion-modal", {
      onGoToDashboard: () => console.debug("Go to dashboard clicked"),
      exerciseTitle: "Test Exercise",
      initialStep: "project-unlocked",
      unlockedProject: project
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Project Unlocked Modal</h1>
      <p className="text-gray-500 mb-8">Isolated dev page for testing the project-unlocked step.</p>

      <div className="space-y-3">
        {SAMPLE_PROJECTS.map((project) => (
          <div key={project.slug} className="border rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">{project.name}</div>
              <div className="text-sm text-gray-500">{project.description}</div>
            </div>
            <button
              onClick={() => trigger(project)}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors whitespace-nowrap"
            >
              Trigger modal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import type { Task, TaskProgress } from "@jiki/curriculum";
import type { Orchestrator } from "../lib/Orchestrator";
import { useOrchestratorStore } from "../lib/orchestrator/store";

interface TasksViewProps {
  tasks: Task[] | undefined;
  orchestrator: Orchestrator;
  className?: string;
}

export default function TasksView({ tasks, orchestrator, className = "" }: TasksViewProps) {
  const { taskProgress, completedTasks, currentTaskId } = useOrchestratorStore(orchestrator);
  if (!tasks || tasks.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-sm text-gray-500 italic">No tasks available for this exercise.</p>
      </div>
    );
  }

  const handleTaskClick = (taskId: string) => {
    orchestrator.setCurrentTask(taskId);
  };

  return (
    <div className={`p-4 ${className}`}>
      <ul className="space-y-3">
        {tasks.map((task, index) => {
          const progress = taskProgress.get(task.id);
          const isCompleted = completedTasks.has(task.id);
          const isCurrent = currentTaskId === task.id;
          const status = progress?.status || "not-started";

          return (
            <li key={task.id} className="flex items-start gap-3">
              <TaskStatusIndicator
                index={index}
                status={status}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                progress={progress}
              />
              <div
                className={`flex-1 cursor-pointer transition-opacity hover:opacity-80 ${
                  isCurrent ? "bg-blue-50 -mx-2 px-2 py-1 rounded" : ""
                }`}
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm ${
                      isCompleted
                        ? "text-green-700 font-medium"
                        : status === "in-progress"
                          ? "text-blue-700"
                          : "text-gray-700"
                    }`}
                  >
                    {task.name}
                    {task.bonus && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">Bonus</span>
                    )}
                  </p>
                  {progress && progress.totalScenarios > 0 && (
                    <span className="text-xs text-gray-500">
                      {progress.passedScenarios.length}/{progress.totalScenarios}
                    </span>
                  )}
                </div>
                {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
                {progress && status === "in-progress" && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{
                          width: `${progress.totalScenarios > 0 ? (progress.passedScenarios.length / progress.totalScenarios) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface TaskStatusIndicatorProps {
  index: number;
  status: "not-started" | "in-progress" | "completed";
  isCompleted: boolean;
  isCurrent: boolean;
  progress?: TaskProgress | null;
}

function TaskStatusIndicator({ index, status, isCompleted, isCurrent }: TaskStatusIndicatorProps) {
  if (isCompleted) {
    return (
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-medium">
        ✓
      </span>
    );
  }

  if (status === "in-progress") {
    return (
      <span
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-50 text-blue-700 text-xs flex items-center justify-center font-medium ${
          isCurrent ? "ring-2 ring-blue-300" : ""
        }`}
      >
        {index + 1}
      </span>
    );
  }

  // not-started
  return (
    <span
      className={`flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center font-medium ${
        isCurrent ? "ring-2 ring-gray-300" : ""
      }`}
    >
      {index + 1}
    </span>
  );
}

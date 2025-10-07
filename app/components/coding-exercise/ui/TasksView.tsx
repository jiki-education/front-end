"use client";

import type { Task } from "@jiki/curriculum";

interface TasksViewProps {
  tasks: Task[] | undefined;
  className?: string;
}

export default function TasksView({ tasks, className = "" }: TasksViewProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-sm text-gray-500 italic">No tasks available for this exercise.</p>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <li key={task.id} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                {task.name}
                {task.bonus && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">Bonus</span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
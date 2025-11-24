import { useState } from "react";
import { PageTabs } from "@/components/ui-kit/PageTabs/PageTabs";
import ChatPanel from "./ui/ChatPanel";
import FunctionsView from "./ui/FunctionsView";
import HintsView from "./ui/HintsView";
import InstructionsPanel from "./ui/InstructionsPanel";
import TasksView from "./ui/TasksView";
import ConsoleTab from "./ui/test-results-view/ConsoleTab";
import type Orchestrator from "./lib/Orchestrator";
import styles from "./CodingExercise.module.css";

interface RHSProps {
  orchestrator: Orchestrator;
}

export function RHS({ orchestrator }: RHSProps) {
  const [activeTab, setActiveTab] = useState("instructions");

  // Define tabs data for PageTabs
  const tabs = [
    { id: "instructions", label: "Instructions" },
    { id: "tasks", label: "Tasks" },
    { id: "functions", label: "Functions" },
    { id: "hints", label: "Hints" },
    { id: "console", label: "Console" },
    { id: "chat", label: "Chat" }
  ];

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "instructions":
        return <InstructionsPanel instructions={orchestrator.getExerciseInstructions()} />;
      case "tasks":
        return <TasksView tasks={orchestrator.getExercise().tasks} orchestrator={orchestrator} />;
      case "functions":
        return <FunctionsView functions={orchestrator.getExercise().functions} />;
      case "hints":
        return <HintsView hints={orchestrator.getExercise().hints} />;
      case "console":
        return <ConsoleTab />;
      case "chat":
        return <ChatPanel />;
      default:
        return <InstructionsPanel instructions={orchestrator.getExerciseInstructions()} />;
    }
  };

  return (
    <div className={styles.rightColumn}>
      <div className="border-b border-gray-200 p-4">
        <PageTabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="flex-1 overflow-auto p-4">{renderTabContent()}</div>
    </div>
  );
}

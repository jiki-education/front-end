import { useState } from "react";
import { PageTabs } from "@/components/ui-kit/PageTabs/PageTabs";
import HamburgerIcon from "@/icons/hamburger.svg";
import HintIcon from "@/icons/hint.svg";
import LogIcon from "@/icons/log.svg";
import ChatIcon from "@/icons/chat.svg";
import ChatPanel from "./ui/ChatPanel";
import FunctionsView from "./ui/FunctionsView";
import HintsPanel from "./ui/HintsPanel";
import { InstructionsPanel } from "./ui/instructions-panel";
import TasksView from "./ui/TasksView";
import LogPanel from "./ui/LogPanel";
import type Orchestrator from "./lib/Orchestrator";
import styles from "./CodingExercise.module.css";

interface RHSProps {
  orchestrator: Orchestrator;
}

export function RHS({ orchestrator }: RHSProps) {
  const [activeTab, setActiveTab] = useState("instructions");

  // Define tabs data for PageTabs
  const tabs = [
    {
      id: "instructions",
      label: "Instructions",
      icon: <HamburgerIcon width={18} height={18} className="mr-2" />
    },
    {
      id: "chat",
      label: "Talk to Jiki",
      icon: <ChatIcon width={18} height={18} className="mr-2" />
    },
    {
      id: "log",
      label: "Log",
      icon: <LogIcon width={18} height={18} className="mr-2" />
    },
    {
      id: "hints",
      label: "Hints",
      icon: <HintIcon width={18} height={18} className="mr-2" />
    }
  ];

  // Function to render content based on active tab
  const renderTabContent = () => {
    const exercise = orchestrator.getExercise();
    switch (activeTab) {
      case "instructions":
        return (
          <InstructionsPanel
            instructions={orchestrator.getExerciseInstructions()}
            functions={exercise.functions}
            conceptSlugs={exercise.conceptSlugs}
          />
        );
      case "tasks":
        return <TasksView tasks={orchestrator.getExercise().tasks} orchestrator={orchestrator} />;
      case "functions":
        return <FunctionsView functions={orchestrator.getExercise().functions} />;
      case "hints":
        return <HintsPanel hints={orchestrator.getExercise().hints} />;
      case "log":
        return <LogPanel />;
      case "chat":
        return <ChatPanel />;
      default:
        return (
          <InstructionsPanel
            instructions={orchestrator.getExerciseInstructions()}
            functions={exercise.functions}
            conceptSlugs={exercise.conceptSlugs}
          />
        );
    }
  };

  return (
    <div className={styles.rightColumn}>
      <PageTabs
        className="py-[3px] px-[32px] bg-white"
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 overflow-auto bg-white">{renderTabContent()}</div>
    </div>
  );
}

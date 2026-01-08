import { useState } from "react";
import { PageTabs } from "@/components/ui-kit/PageTabs/PageTabs";
import HamburgerIcon from "@/icons/hamburger.svg";
import HintIcon from "@/icons/hint.svg";
import LogIcon from "@/icons/log.svg";
import ChatIcon from "@/icons/chat.svg";
import ChatPanel from "./ui/ChatPanel";
import FunctionsView from "./ui/FunctionsView";
import HintsView from "./ui/HintsView";
import { InstructionsPanel } from "./ui/instructions-panel";
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
      id: "console",
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
      <PageTabs className="py-[3px] px-[32px]" tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">{renderTabContent()}</div>
    </div>
  );
}

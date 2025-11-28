import { useState } from "react";
import { PageTabs } from "@/components/ui-kit/PageTabs/PageTabs";
import FileIcon from "@/icons/file.svg";
import CompleteIcon from "@/icons/complete.svg";
import FolderIcon from "@/icons/folder.svg";
import BugIcon from "@/icons/bug.svg";
import WindowIcon from "@/icons/window.svg";
import EmailIcon from "@/icons/email.svg";
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
      icon: <FileIcon width={18} height={18} className="mr-2" />
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <CompleteIcon width={18} height={18} className="mr-2" />
    },
    {
      id: "functions",
      label: "Functions",
      icon: <FolderIcon width={18} height={18} className="mr-2" />
    },
    {
      id: "hints",
      label: "Hints",
      icon: <BugIcon width={18} height={18} className="mr-2" />
    },
    {
      id: "console",
      label: "Console",
      icon: <WindowIcon width={18} height={18} className="mr-2" />
    },
    {
      id: "chat",
      label: "Chat",
      icon: <EmailIcon width={18} height={18} className="mr-2" />
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
      <div className="p-4">
        <PageTabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="flex-1 overflow-auto">{renderTabContent()}</div>
    </div>
  );
}

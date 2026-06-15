import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTabs } from "@/components/ui-kit/PageTabs/PageTabs";
import type { PageTabsProps } from "@/components/ui-kit/PageTabs/types";
import ArrowRightIcon from "@/icons/arrow-right.svg";
import ChevronRightIcon from "@/icons/chevron-right.svg";
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
import { useOrchestratorStore } from "./lib/Orchestrator";
import styles from "./CodingExercise.module.css";

interface RHSProps {
  orchestrator: Orchestrator;
}

export function RHS({ orchestrator }: RHSProps) {
  const [activeTab, setActiveTab] = useState("instructions");
  const router = useRouter();
  const { isExerciseCompleted } = useOrchestratorStore(orchestrator);
  const isProject = orchestrator.isProject();
  const navTarget = isProject ? "/projects" : "/dashboard";
  const navLabel = isProject ? "Projects" : "Dashboard";
  const logTabDisabled = orchestrator.getExercise().disableLogTab === true;

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
    ...(logTabDisabled
      ? []
      : [
          {
            id: "log",
            label: "Log",
            icon: <LogIcon width={18} height={18} className="mr-2" />
          }
        ]),
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
            exerciseTitle={exercise.title}
            exerciseSlug={exercise.slug}
            levelId={exercise.levelId}
            isProject={orchestrator.isProject()}
          />
        );
      case "tasks":
        return <TasksView tasks={orchestrator.getExercise().tasks} orchestrator={orchestrator} />;
      case "functions":
        return <FunctionsView functions={orchestrator.getExercise().functions} />;
      case "hints": {
        const context = orchestrator.getStore().getState().context;
        const walkthroughVideoData = context.type === "lesson" ? context.walkthroughVideoData : undefined;
        const lessonSlug = context.slug;
        return (
          <HintsPanel
            hints={orchestrator.getExercise().hints}
            walkthroughVideoData={walkthroughVideoData}
            lessonSlug={lessonSlug}
          />
        );
      }
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
            exerciseTitle={exercise.title}
            exerciseSlug={exercise.slug}
            levelId={exercise.levelId}
            isProject={orchestrator.isProject()}
          />
        );
    }
  };

  return (
    <div className={styles.rightColumn}>
      <div className="flex items-center gap-[24px] px-[32px] py-[8px] bg-white flex-shrink-0">
        <ScrollableTabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
        <button
          onClick={() => router.push(navTarget)}
          className={`ui-btn ui-btn-xs ui-btn-flat flex-row-reverse shrink-0${isExerciseCompleted ? " !text-[var(--color-green-600)] font-semibold !bg-[var(--color-green-50)] !border-[var(--color-green-600)] gap-[4px]" : ""}`}
        >
          <ArrowRightIcon width={16} height={16} />
          {navLabel}
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-white">{renderTabContent()}</div>
    </div>
  );
}

function ScrollableTabs(props: PageTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setCanScrollStart(el.scrollLeft > 0);
      setCanScrollEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const outerClasses = [
    styles.tabsOuter,
    canScrollStart ? styles.canScrollStart : "",
    canScrollEnd ? styles.canScrollEnd : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={outerClasses}>
      <div ref={scrollRef} className={styles.tabsScroll}>
        <PageTabs {...props} className="shrink-0 whitespace-nowrap" />
      </div>
      <div className={`${styles.tabsFade} ${styles.tabsFadeStart}`} aria-hidden="true">
        <ChevronRightIcon style={{ transform: "rotate(180deg)" }} />
      </div>
      <div className={`${styles.tabsFade} ${styles.tabsFadeEnd}`} aria-hidden="true">
        <ChevronRightIcon />
      </div>
    </div>
  );
}

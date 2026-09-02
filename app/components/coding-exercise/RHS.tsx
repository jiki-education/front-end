import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("codingExercise.rhs");
  const [activeTab, setActiveTab] = useState("instructions");
  const router = useRouter();
  const { isExerciseCompleted, levelTitle } = useOrchestratorStore(orchestrator);
  const isChallenge = orchestrator.isChallenge();
  const navTarget = isChallenge ? "/challenges" : "/dashboard";
  const navLabel = isChallenge ? t("navChallenges") : t("navDashboard");
  const logTabDisabled = orchestrator.getExercise().disableLogTab === true;

  // Define tabs data for PageTabs
  const tabs = [
    {
      id: "instructions",
      label: t("tabInstructions"),
      icon: <HamburgerIcon width={18} height={18} className={styles.tabIcon} />
    },
    {
      id: "chat",
      label: t("tabAskJiki"),
      icon: <ChatIcon width={18} height={18} className={styles.tabIcon} />
    },
    ...(logTabDisabled
      ? []
      : [
          {
            id: "log",
            label: t("tabLog"),
            icon: <LogIcon width={18} height={18} className={styles.tabIcon} />
          }
        ]),
    {
      id: "hints",
      label: t("tabHints"),
      icon: <HintIcon width={18} height={18} className={styles.tabIcon} />
    }
  ];

  // Function to render content based on active tab
  const renderTabContent = () => {
    const lessonContext = orchestrator.getStore().getState().context;
    const introVideo = lessonContext.type === "lesson" ? lessonContext.introVideo : undefined;
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
            levelTitle={levelTitle}
            isChallenge={orchestrator.isChallenge()}
            introVideo={introVideo}
          />
        );
      case "tasks":
        return <TasksView tasks={orchestrator.getExercise().tasks} orchestrator={orchestrator} />;
      case "functions":
        return <FunctionsView functions={orchestrator.getExercise().functions} />;
      case "hints": {
        const context = orchestrator.getStore().getState().context;
        const deepDiveVideo = context.type === "lesson" ? context.deepDiveVideo : undefined;
        const lessonSlug = context.slug;
        return (
          <HintsPanel hints={orchestrator.getExercise().hints} deepDiveVideo={deepDiveVideo} lessonSlug={lessonSlug} />
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
            levelTitle={levelTitle}
            isChallenge={orchestrator.isChallenge()}
            introVideo={introVideo}
          />
        );
    }
  };

  return (
    <div className={styles.rightColumn}>
      <div className={styles.rhsToolbar}>
        <ScrollableTabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
        <button
          onClick={() => router.push(navTarget)}
          className={`ui-btn ui-btn-xs ui-btn-flat ${styles.navButton}${isExerciseCompleted ? ` ${styles.navButtonCompleted}` : ""}`}
        >
          <ArrowRightIcon width={16} height={16} />
          {navLabel}
        </button>
      </div>
      <div className={styles.rhsContent}>{renderTabContent()}</div>
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
        <PageTabs {...props} className={styles.tabsPageTabs} />
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

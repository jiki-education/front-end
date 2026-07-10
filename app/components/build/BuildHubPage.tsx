import { PageHeader } from "@/components/ui-kit/PageHeader";
import DividerIcon from "@/icons/divider.svg";
import LearningComputerIcon from "@/icons/learning-computer.svg";
import type { ProjectMeta } from "@/lib/content/types";
import ProjectCard from "@/components/projects/ProjectCard";
import styles from "./BuildHubPage.module.css";
import { PlaceholderVideo } from "./PlaceholderVideo";
import { UpcomingStreams } from "./UpcomingStreams";

interface BuildHubPageProps {
  projects: ProjectMeta[];
  locale: string;
}

export default function BuildHubPage({ projects, locale }: BuildHubPageProps) {
  return (
    <PageHeader
      icon={<LearningComputerIcon />}
      title={title}
      description="Join Jeremy as he builds real projects from scratch, episode by episode."
    >
      <div className={styles.layout}>
        <div className={styles.main}>
          <PlaceholderVideo playbackId="C02KFBxFBi7CXyGi4tRvgjsfshn02poy2IXrFyiZrcQhE" />
          <DividerIcon className={styles.sectionDivider} aria-hidden="true" />
          <h3 className={styles.sectionHeading}>Projects</h3>
          <p className={styles.sectionLead}>Each project is a series of episodes building something real.</p>
          <div className={styles.projectsList}>
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} />
            ))}
          </div>
        </div>
        <aside className={styles.sidebar}>
          <UpcomingStreams projects={projects} />
        </aside>
      </div>
    </PageHeader>
  );
}

const title = (
  <>
    Learn to Build
    <span className={styles.titleBadge}>Launching July 11th</span>
  </>
);

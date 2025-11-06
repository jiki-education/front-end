import { api } from "./client";

export type ProjectStatus = "locked" | "unlocked" | "started" | "completed";

export interface ProjectData {
  slug: string;
  title: string;
  description: string;
  status?: ProjectStatus;
  exercise_slug?: string;
}

export interface ProjectsResponse {
  results: ProjectData[];
  meta: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface ProjectSubmissionFile {
  filename: string;
  code: string;
}

/**
 * Fetch all projects with status for current user
 */
export async function fetchProjects(params?: {
  title?: string;
  page?: number;
  per?: number;
}): Promise<ProjectsResponse> {
  const response = await api.get<ProjectsResponse>("/internal/projects", {
    params
  });

  return response.data;
}

/**
 * Fetch individual project details by slug
 */
export async function fetchProject(slug: string): Promise<ProjectData> {
  const response = await api.get<{ project: ProjectData }>(`/internal/projects/${slug}`);
  return response.data.project;
}

/**
 * Submit exercise files for a project
 */
export async function submitProjectExercise(slug: string, files: ProjectSubmissionFile[]): Promise<void> {
  await api.post(`/internal/projects/${slug}/exercise_submissions`, {
    submission: { files }
  });
}

/**
 * Start tracking a project - called when user first accesses a project
 * Note: For now, projects are automatically started when first submission is made
 * This function is a placeholder for explicit start tracking if needed
 */
export function startProject(slug: string): void {
  // TODO: Backend doesn't have explicit start endpoint yet
  // Projects are automatically started when first submission is made
  // This could be implemented later if explicit start tracking is needed
  // eslint-disable-next-line no-console
  console.log(`Project ${slug} accessed - will be started on first submission`);
}

/**
 * Mark a project as completed
 * Note: For now, projects are marked complete based on successful submissions
 * This function is a placeholder for explicit completion if needed
 */
export function markProjectComplete(slug: string): void {
  // TODO: Backend doesn't have explicit complete endpoint yet
  // Projects are marked complete based on successful submissions
  // This could be implemented later if explicit completion is needed
  // eslint-disable-next-line no-console
  console.log(`Project ${slug} completed - handled by submission logic`);
}

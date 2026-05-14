import { api } from "./client";
import type { UserConversationData } from "./types/conversation";

export type ProjectStatus = "locked" | "unlocked" | "started" | "completed";

export interface UserProjectData extends UserConversationData {
  project_slug: string;
}

interface UserProjectResponse {
  user_project: UserProjectData;
}

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
 * Start tracking a project - called when the user opens a project.
 * Acts as the lock-enforcement point for the detail route: rejects with a 403
 * (project_locked / premium_required) or 404 (project_not_found) when the user
 * may not access the project.
 */
export async function startProject(slug: string): Promise<void> {
  await api.post(`/internal/user_projects/${slug}/start`);
}

export async function markProjectComplete(slug: string): Promise<{ meta?: { events?: unknown[] } }> {
  const response = await api.patch<{ meta?: { events?: unknown[] } }>(`/internal/user_projects/${slug}/complete`);
  return response.data;
}

/**
 * Fetch user project data including conversation history.
 * Throws NotFoundError if the user project (or underlying project) doesn't exist.
 */
export async function fetchUserProject(slug: string): Promise<UserProjectData> {
  const response = await api.get<UserProjectResponse>(`/internal/user_projects/${slug}`);
  return response.data.user_project;
}

import type {
  Course,
  CourseResponse,
  CoursesResponse,
  ProgrammingLanguage,
  UserCourse,
  UserCourseResponse,
  UserCoursesResponse
} from "@/types/course";
import { CURRENT_COURSE_SLUG } from "@/lib/constants/course";
import { api } from "./client";

export async function fetchCourses(): Promise<Course[]> {
  const response = await api.get<CoursesResponse>("/internal/courses");
  return response.data.courses;
}

export async function fetchCourse(slug: string): Promise<Course> {
  const response = await api.get<CourseResponse>(`/internal/courses/${slug}`);
  return response.data.course;
}

export async function enrollInCourse(slug: string): Promise<UserCourse> {
  const response = await api.post<UserCourseResponse>(`/internal/user_courses/${slug}/enroll`);
  return response.data.user_course;
}

export async function fetchUserCourses(): Promise<UserCourse[]> {
  const response = await api.get<UserCoursesResponse>("/internal/user_courses");
  return response.data.user_courses;
}

export async function fetchUserCourse(): Promise<UserCourse> {
  const response = await api.get<UserCourseResponse>(`/internal/user_courses/${CURRENT_COURSE_SLUG}`);
  return response.data.user_course;
}

export async function setLanguageChoice(language: ProgrammingLanguage): Promise<UserCourse> {
  const response = await api.patch<UserCourseResponse>(`/internal/user_courses/${CURRENT_COURSE_SLUG}/language`, {
    language
  });
  return response.data.user_course;
}

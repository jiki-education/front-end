export type ProgrammingLanguage = "javascript" | "python";

export interface Course {
  slug: string;
  title: string;
  description: string;
  language_options: ProgrammingLanguage[];
}

export interface UserCourse {
  course_slug: string;
  language: ProgrammingLanguage | null;
  language_chosen: boolean;
  current_level_slug: string | null;
  completed: boolean;
}

export interface CoursesResponse {
  courses: Course[];
}

export interface CourseResponse {
  course: Course;
}

export interface UserCoursesResponse {
  user_courses: UserCourse[];
}

export interface UserCourseResponse {
  user_course: UserCourse;
}

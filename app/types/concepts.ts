import type { VideoData } from "./lesson";

export interface ConceptAncestor {
  title: string;
  slug: string;
}

export interface ConceptListItem {
  title: string;
  slug: string;
  description: string;
  children_count: number;
  user_may_access: boolean;
  video_data: VideoData[] | null;
}

export interface ConceptDetail {
  title: string;
  slug: string;
  description: string;
  content_html: string;
  children_count: number;
  user_may_access: boolean;
  ancestors: ConceptAncestor[];
  video_data: VideoData[] | null;
}

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
  standard_video_provider: string | null;
  standard_video_id: string | null;
  premium_video_provider: string | null;
  premium_video_id: string | null;
}

export interface ConceptDetail {
  title: string;
  slug: string;
  description: string;
  content_html: string;
  children_count: number;
  user_may_access: boolean;
  ancestors: ConceptAncestor[];
  standard_video_provider: string | null;
  standard_video_id: string | null;
  premium_video_provider: string | null;
  premium_video_id: string | null;
}

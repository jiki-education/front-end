export interface ConceptListItem {
  title: string;
  slug: string;
  description: string;
  iconSrc?: string;
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
  standard_video_provider: string | null;
  standard_video_id: string | null;
  premium_video_provider: string | null;
  premium_video_id: string | null;
}

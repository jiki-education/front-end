import { getAllArticles } from "@jiki/content";
import ArticlesContent from "./ArticlesContent";

export default function ArticlesPage() {
  const articles = getAllArticles("en");

  return <ArticlesContent articles={articles} />;
}

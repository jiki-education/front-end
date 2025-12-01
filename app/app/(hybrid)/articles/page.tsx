import ArticlesPage from "@/components/articles/ArticlesPage";
import HeaderLayout from "@/components/layout/HeaderLayout";

export default function AppArticlesPage() {
  return (
    <HeaderLayout>
      <ArticlesPage authenticated locale="en" />
    </HeaderLayout>
  );
}

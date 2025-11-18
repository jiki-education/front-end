import Sidebar from "@/components/index-page/sidebar/Sidebar";

interface ConceptsLayoutProps {
  children: React.ReactNode;
  withSidebar: boolean;
}

export default function ConceptsLayout({ children, withSidebar }: ConceptsLayoutProps) {
  if (withSidebar) {
    return (
      <div className="min-h-screen bg-bg-secondary theme-transition">
        <Sidebar activeItem="concepts" />
        <div className="ml-[260px]">
          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  }

  return <div className="container mx-auto max-w-7xl px-4 py-12">{children}</div>;
}

import Sidebar from "@/components/index-page/sidebar/Sidebar";

interface ConceptsLayoutProps {
  children: React.ReactNode;
  withSidebar: boolean;
}

export default function ConceptsLayout({ children, withSidebar }: ConceptsLayoutProps) {
  if (withSidebar) {
    return (
      <div className="min-h-screen">
        <Sidebar activeItem="concepts" />
        <div className="main-content">
          <div className="container">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">{children}</div>
    </div>
  );
}

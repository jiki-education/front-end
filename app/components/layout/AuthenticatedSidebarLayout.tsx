import Sidebar from "./sidebar/Sidebar";

interface AuthenticatedSidebarLayoutProps {
  children: React.ReactNode;
  activeItem?: "learn" | "projects" | "blog" | "concepts" | "settings";
}

export default function AuthenticatedSidebarLayout({
  children,
  activeItem = "learn"
}: AuthenticatedSidebarLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-secondary theme-transition flex">
      <Sidebar activeItem={activeItem} />
      <div className="flex-1">{children}</div>
    </div>
  );
}

import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ icon, title, description, children }: PageHeaderProps) {
  return (
    <div className="max-w-screen-xl mx-auto py-16 px-8 sm:py-20 sm:px-12 lg:py-32 lg:px-48">
      <header className="ui-page-header">
        <h1>
          {icon}
          {title}
        </h1>
        <p>{description}</p>
      </header>
      {children}
    </div>
  );
}

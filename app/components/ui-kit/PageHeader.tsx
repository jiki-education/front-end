import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ icon, title, description, children }: PageHeaderProps) {
  return (
    <div className="max-w-screen-xl mx-auto py-32 px-48">
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

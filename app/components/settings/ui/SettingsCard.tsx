import type { ReactNode } from "react";

interface SettingsCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function SettingsCard({ children, title, description, className = "" }: SettingsCardProps) {
  return (
    <section className={`bg-bg-secondary rounded-lg p-6 border border-border-primary ${className}`}>
      {title && (
        <header className="mb-4">
          <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
          {description && <p className="text-text-secondary">{description}</p>}
        </header>
      )}

      <div className="space-y-4">{children}</div>
    </section>
  );
}

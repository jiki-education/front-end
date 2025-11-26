interface MarkdownContentProps {
  content: string;
  className?: string;
  variant?: "base" | "large";
}

export default function MarkdownContent({ content, className = "", variant = "large" }: MarkdownContentProps) {
  const variantClass = variant === "base" ? "ui-textual-content-base" : "ui-textual-content-large";

  return (
    <div className={`ui-textual-content ${variantClass} ${className}`} dangerouslySetInnerHTML={{ __html: content }} />
  );
}

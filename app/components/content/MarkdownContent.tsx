interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div
      className={`ui-textual-content ui-textual-content-large ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

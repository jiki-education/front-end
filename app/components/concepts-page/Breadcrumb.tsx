interface BreadcrumbItem {
  label: string;
  href?: string;
  isLabel?: boolean;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <span
          key={index}
          className={`breadcrumb-item ${
            item.isLabel ? "breadcrumb-label" : item.isCurrent ? "breadcrumb-current" : ""
          }`}
        >
          {item.href && !item.isCurrent ? <a href={item.href}>{item.label}</a> : item.label}
        </span>
      ))}
    </div>
  );
}

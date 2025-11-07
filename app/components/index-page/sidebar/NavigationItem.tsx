import { useRouter } from "next/navigation";

interface NavigationItemProps {
  id: string;
  label: string;
  isActive: boolean;
  href?: string;
}

export function NavigationItem({ label, isActive, href }: NavigationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <li>
      <button
        onClick={handleClick}
        className={`
          w-full text-left px-4 py-3 rounded-lg transition-colors focus-ring
          ${isActive ? "bg-info-bg text-info-text font-medium" : "text-text-primary hover:bg-bg-secondary"}
        `}
      >
        {label}
      </button>
    </li>
  );
}

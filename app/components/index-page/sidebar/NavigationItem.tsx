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
          w-full text-left px-4 py-3 rounded-lg transition-colors
          ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
        `}
      >
        {label}
      </button>
    </li>
  );
}

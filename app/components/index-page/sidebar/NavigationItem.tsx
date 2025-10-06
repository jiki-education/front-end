interface NavigationItemProps {
  id: string;
  label: string;
  isActive: boolean;
}

export function NavigationItem({ label, isActive }: NavigationItemProps) {
  return (
    <li>
      <button
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

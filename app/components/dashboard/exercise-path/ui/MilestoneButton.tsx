interface MilestoneButtonProps {
  levelTitle: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function MilestoneButton({ levelTitle, onClick, disabled = false, className = "" }: MilestoneButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 
        text-white font-bold rounded-xl shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:scale-105 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        border-4 border-yellow-300 hover:border-yellow-200
        ${className}
      `}
      aria-label={`Complete ${levelTitle} milestone`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
      
      {/* Button content */}
      <div className="relative flex items-center gap-3">
        <div className="text-2xl">🏆</div>
        <div className="text-left">
          <div className="text-sm font-medium opacity-90">Complete Level</div>
          <div className="text-lg font-bold">{levelTitle}</div>
        </div>
      </div>
      
      {/* Shine animation */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
    </button>
  );
}
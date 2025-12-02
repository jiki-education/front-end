interface PathConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  completed: boolean;
}

export function PathConnection({ from, to, completed }: PathConnectionProps) {
  // Calculate positions relative to the center of the viewBox (100 is center of 200 width viewBox)
  const x1 = 100 + from.x / 5; // Scale down x coordinates to fit viewBox
  const y1 = from.y + 25; // Adjusted for new button height
  const x2 = 100 + to.x / 5;
  const y2 = to.y + 25;

  const controlPoint1X = x1;
  const controlPoint1Y = y1 + (y2 - y1) * 0.4;
  const controlPoint2X = x2;
  const controlPoint2Y = y2 - (y2 - y1) * 0.4;

  return (
    <path
      d={`M ${x1} ${y1} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${x2} ${y2}`}
      stroke={completed ? "#10b981" : "#d1d5db"}
      strokeWidth="4"
      strokeDasharray={completed ? "0" : "8 8"}
      fill="none"
      className={completed ? "" : "animate-pulse"}
    />
  );
}

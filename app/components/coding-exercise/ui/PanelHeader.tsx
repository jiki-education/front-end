import styles from "./instructions-panel/instructions-panel.module.css";
import { assembleClassNames } from "@/lib/assemble-classnames";

export function PanelHeader({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={assembleClassNames(styles.panelHeader, "flex items-center px-32 py-16 gap-16")}>
      <div className="flex text-white h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#8B5CF6_0%,#3B82F6_100%)]">
        {icon}
      </div>

      <div className="flex-1">
        <h1 className="mb-1 text-[32px] font-[650] leading-[1.1] text-slate-900">{title}</h1>

        <p className="text-[15px] font-medium leading-[1.6] text-slate-500">{description}</p>
      </div>
    </div>
  );
}

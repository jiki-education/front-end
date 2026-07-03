import { useTranslations } from "next-intl";
import { ConceptsLayout } from "@/components/concepts";

interface ConceptErrorViewProps {
  message: string | null;
  onBack: () => void;
}

export function ConceptErrorView({ message, onBack }: ConceptErrorViewProps) {
  const t = useTranslations("concepts.error");
  return (
    <ConceptsLayout>
      <div className="text-center">
        <div className="mb-4 text-red-600 text-lg">{message ?? t("notFound")}</div>
        <button onClick={onBack} className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
          {t("back")}
        </button>
      </div>
    </ConceptsLayout>
  );
}

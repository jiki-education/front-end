import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useForumUrl } from "@/lib/i18n/externalLinks";

/**
 * Show an error toast when a lesson's progress could not be saved to the API
 * (e.g. a failed "mark complete" request). Points the user at the forum so a
 * persistent failure gets reported rather than silently swallowed.
 */
export function showLessonSaveErrorToast() {
  toast.error(<LessonSaveErrorMessage />);
}

function LessonSaveErrorMessage() {
  const t = useTranslations("toasts");
  const forumUrl = useForumUrl();
  return (
    <span>
      {t.rich("exercise.lessonSaveError", {
        link: (chunks) => (
          <a
            href={forumUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "1px" }}
          >
            {chunks}
          </a>
        )
      })}
    </span>
  );
}

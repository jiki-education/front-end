import toast from "react-hot-toast";

const FORUM_URL = "https://forum.jiki.io";

/**
 * Show an error toast when a lesson's progress could not be saved to the API
 * (e.g. a failed "mark complete" request). Points the user at the forum so a
 * persistent failure gets reported rather than silently swallowed.
 */
export function showLessonSaveErrorToast() {
  toast.error(
    <span>
      Sorry, the lesson could not be completed. Please try again. If this continues, please report on{" "}
      <a
        href={FORUM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "1px" }}
      >
        {FORUM_URL}
      </a>
    </span>
  );
}

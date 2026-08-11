import { useTranslations } from "next-intl";
import { ChatIcon, InfoIcon, LinesIcon, LogIcon, SendIcon } from "./icons";
import type { VideoState } from "./state";
import styles from "./LtcVideo.module.css";

const JIKI_AVATAR = "/static/images/chat-jiki-avatar.png";
const LEARNER_AVATAR = "/static/images/ltc-learner-avatar.jpg";

/** The thread, in order. `n` is the beat that reveals each message. */
const MESSAGES = [
  { n: 1, from: "jiki", key: "chat1" },
  { n: 2, from: "me", key: "chat2" },
  { n: 3, from: "jiki", key: "chat3" },
  { n: 4, from: "me", key: "chat4" },
  { n: 5, from: "jiki", key: "chat5" }
] as const;

/**
 * The right-hand panel: the instructions the exercise ships with, and the Ask Jiki thread the
 * learner opens when the code breaks. Only one is visible; they crossfade.
 */
export function PanelTabs({ state }: { state: VideoState }) {
  const t = useTranslations("landing.learnToCode.demo");

  return (
    <div className={`${styles.card} ${styles.panel}`}>
      {/* No `tablist`/`tab` roles: these are drawn tabs, not operable ones — no focus, no
          `tabpanel`, no keyboard behaviour — so the roles would describe a widget that isn't
          there. The selected tab is styled off a data attribute instead. */}
      <div className={styles.tabs}>
        <Tab label={t("tabInstructions")} selected={state.tab === "instructions"} icon={<LinesIcon />} />
        <Tab label={t("tabJiki")} selected={state.tab === "jiki"} icon={<ChatIcon />} />
        <Tab label={t("tabLog")} selected={false} icon={<LogIcon />} />
        <Tab label={t("tabHints")} selected={false} icon={<InfoIcon />} />
      </div>

      <div
        className={`${styles.shotState} ${styles.instructions} ${state.tab === "instructions" ? styles.shotStateLive : ""}`}
      >
        {/* Drawn scenery, so deliberately not a real heading — see the modal title. */}
        <div className={styles.instrHeading}>{t("instrHeading")}</div>
        <p>{t("instr1")}</p>
        <p>{t("instr2")}</p>
        <ul>
          <li>
            <code>move_right()</code> {t("fnRight")}
          </li>
          <li>
            <code>move_left()</code> {t("fnLeft")}
          </li>
          <li>
            <code>shoot()</code> {t("fnShoot")}
          </li>
        </ul>
        <p>{t("instr3")}</p>
      </div>

      <AskJiki state={state} />
    </div>
  );
}

/** The chat thread, plus the input the learner's reply is typed into. */
function AskJiki({ state }: { state: VideoState }) {
  const t = useTranslations("landing.learnToCode.demo");

  // The reply is sliced by fraction rather than per character, so every translation finishes
  // typing at the same moment however long it is.
  const typed = state.typingKey ? t(state.typingKey) : "";
  const shownText = typed.slice(0, Math.ceil(typed.length * state.typingFraction));
  const isTyping = state.typingKey !== null && state.typingFraction > 0;

  return (
    <div className={`${styles.shotState} ${styles.jikiPanel} ${state.tab === "jiki" ? styles.shotStateLive : ""}`}>
      <div className={styles.chat}>
        {MESSAGES.map((message) => (
          <div
            key={message.n}
            className={`${styles.msg} ${message.from === "jiki" ? styles.msgJiki : styles.msgMe} ${
              state.shownMessages >= message.n ? styles.msgShown : ""
            }`}
          >
            <span
              className={styles.who}
              style={{ backgroundImage: `url(${message.from === "jiki" ? JIKI_AVATAR : LEARNER_AVATAR})` }}
              {...(message.from === "jiki" ? { role: "img", "aria-label": t("jikiAvatarAlt") } : {})}
            />
            <span className={styles.bubble}>{t.rich(message.key, { code: (chunks) => <code>{chunks}</code> })}</span>
          </div>
        ))}
      </div>

      <div className={styles.chatInput}>
        <span className={styles.who} style={{ backgroundImage: `url(${LEARNER_AVATAR})` }} />
        <div className={styles.chatField}>
          <div className={`${styles.chatBox} ${isTyping ? styles.chatBoxTyping : ""}`}>
            {isTyping ? shownText : t("chatPlaceholder")}
            {isTyping && <span className={styles.caret} />}
          </div>
          <span className={`${styles.send} ${state.sendPressed ? styles.sendPressed : ""}`}>
            <SendIcon />
          </span>
        </div>
      </div>
    </div>
  );
}

function Tab({ label, selected, icon }: { label: string; selected: boolean; icon: React.ReactNode }) {
  return (
    <div className={styles.tab} data-selected={selected || undefined}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

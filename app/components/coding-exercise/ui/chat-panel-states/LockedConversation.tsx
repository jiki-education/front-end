"use client";

import { useRef } from "react";
import Link from "next/link";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import ChatMessageItem from "../ChatMessageItem";
import { useTimelineHeight } from "../../lib/useTimelineHeight";
import LockIcon from "@/icons/lock.svg";
import type { ChatMessage } from "../../lib/chat-types";
import styles from "./LockedConversation.module.css";
import chatStyles from "../chat-panel.module.css";

type LockedConversationVariant = "free-limit-reached" | "premium-blocked";

interface LockedConversationProps {
  messages?: ChatMessage[];
  variant: LockedConversationVariant;
}

// Shared component for locked conversation states
// - free-limit-reached: Non-premium user who has used their free conversation
// - premium-blocked: Premium user who hit fair use limits
export default function LockedConversation({ messages = [], variant }: LockedConversationProps) {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useTimelineHeight({ chatMessagesRef, scrollWrapperRef }, [messages]);

  const handleUpgradeClick = () => {
    showModal("premium-upgrade-modal", {}, undefined, premiumModalStyles.premiumModalWidth);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerBox}>
          <h2 className={styles.headerTitle}>Talk to Jiki</h2>
          <p className={styles.headerDescription}>Your AI coding assistant is here to help you get unstuck</p>
        </div>
      </div>

      <div ref={scrollWrapperRef} className={styles.messagesWrapper}>
        <div ref={chatMessagesRef} className={chatStyles.chatMessages}>
          {messages.map((message, index) => (
            <ChatMessageItem key={`message-${index}`} message={message} />
          ))}

          <div className={styles.lockedIndicator}>
            <div className={styles.lockedAvatar}>
              <LockIcon width={12} height={12} />
            </div>
            <div className={styles.lockedPlaceholder} />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerBox}>
          {variant === "free-limit-reached" ? (
            <p className={styles.footerText}>
              You&apos;re no longer on the Premium Plan.{" "}
              <button onClick={handleUpgradeClick} className={styles.upgradeLink}>
                Upgrade
              </button>{" "}
              to continue the conversation.
            </p>
          ) : (
            <>
              <p className={styles.footerText}>You&apos;ve hit our fair use limits. Please try again tomorrow.</p>
              <p className={styles.footerLink}>
                <Link href="/fair-use-limits" className={styles.footerLinkGray}>
                  Learn more about fair use limits
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

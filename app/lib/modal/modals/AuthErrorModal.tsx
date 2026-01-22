"use client";

import styles from "./AuthErrorModal.module.css";

export function AuthErrorModal() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>JIKI</div>

      <div className={styles.illustrationContainer}>
        <AvatarLockSvg />
      </div>

      <h1 className={styles.title}>You&apos;ve been Logged out.</h1>
      <p className={styles.subtitle}>
        For some reason you&apos;ve been logged out (maybe a security check, maybe you logged out on a different
        device?). Please reload the page to continue.
      </p>

      <button className={styles.reloadButton} onClick={handleReload}>
        <ReloadIcon />
        Reload Page
      </button>

      <p className={styles.helpText}>
        If this keeps happening, try{" "}
        <a href="#" className={styles.helpLink}>
          clearing your cookies
        </a>{" "}
        or{" "}
        <a href="#" className={styles.helpLink}>
          contact support
        </a>
        .
      </p>
    </div>
  );
}

function AvatarLockSvg() {
  return (
    <svg className={styles.illustration} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clip paths for left and right halves */}
      <defs>
        <clipPath id="leftHalf">
          <rect x="0" y="0" width="100" height="200" />
        </clipPath>
        <clipPath id="rightHalf">
          <rect x="100" y="0" width="100" height="200" />
        </clipPath>
        <clipPath id="avatarClip">
          <circle cx="100" cy="100" r="84" />
        </clipPath>
      </defs>

      {/* Left avatar half */}
      <g clipPath="url(#leftHalf)">
        <circle cx="100" cy="100" r="84" fill="#c4c4c4" />
        <g clipPath="url(#avatarClip)">
          <circle cx="100" cy="72" r="30" fill="#9e9e9e" />
          <ellipse cx="100" cy="162" rx="54" ry="48" fill="#9e9e9e" />
        </g>
      </g>

      {/* Right avatar half (more faded) */}
      <g clipPath="url(#rightHalf)" opacity="0.35">
        <circle cx="100" cy="100" r="84" fill="#c4c4c4" />
        <g clipPath="url(#avatarClip)">
          <circle cx="100" cy="72" r="30" fill="#9e9e9e" />
          <ellipse cx="100" cy="162" rx="54" ry="48" fill="#9e9e9e" />
        </g>
      </g>

      {/* Dotted dividing line - above and below padlock */}
      {/* White background lines */}
      <line x1="99.8" y1="5" x2="99.8" y2="65" stroke="white" strokeWidth="4" />
      <line x1="99.8" y1="135" x2="99.8" y2="195" stroke="white" strokeWidth="4" />
      {/* Dotted lines on top */}
      <line x1="99.8" y1="5" x2="99.8" y2="65" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="99.8" y1="135" x2="99.8" y2="195" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4" />

      {/* Padlock centered on dividing line */}
      <g transform="translate(100, 100)">
        {/* Glow effect */}
        <circle cx="0" cy="0" r="38" fill="#ef4444" className={styles.lockGlow} />
        {/* White circle background */}
        <circle cx="0" cy="0" r="32" fill="white" stroke="#ef4444" strokeWidth="3" />
        {/* Padlock shackle */}
        <path d="M-9 -2 V-10 A9 9 0 0 1 9 -10 V-2" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Padlock body */}
        <rect x="-13" y="-2" width="26" height="18" rx="3" fill="#ef4444" />
        {/* Keyhole */}
        <circle cx="0" cy="5" r="2.5" fill="white" />
        <rect x="-1.5" y="5" width="3" height="6" rx="1" fill="white" />
      </g>
    </svg>
  );
}

function ReloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="20"
      height="20"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M21 21v-5h-5" />
    </svg>
  );
}

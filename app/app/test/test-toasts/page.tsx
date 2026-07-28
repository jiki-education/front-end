"use client";

import toast from "react-hot-toast";
import styles from "./page.module.css";

export default function TestToastsPage() {
  const showToast = () => toast("Here's your toast!");

  const showSuccess = () => toast.success("Successfully created!");

  const showError = () => toast.error("This didn't work.");

  const showLoading = () => {
    const loadingToast = toast.loading("Saving...");

    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Saved!");
    }, 2000);
  };

  const showPromise = () => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("Success!");
        } else {
          reject("Failed!");
        }
      }, 2000);
    });

    void toast.promise(myPromise, {
      loading: "Loading...",
      success: "Got the data",
      error: "Error when fetching"
    });
  };

  const showCustom = () => {
    toast.custom((t) => (
      <div className={styles.customToast} data-visible={t.visible}>
        <div className={styles.customToastBody}>
          <div className={styles.customToastRow}>
            <div className={styles.customToastText}>
              <p className={styles.customToastHeading}>Custom Notification</p>
              <p className={styles.customToastSubtext}>This is a custom styled toast!</p>
            </div>
          </div>
        </div>
        <div className={styles.customToastDivider}>
          <button onClick={() => toast.dismiss(t.id)} className={styles.customToastClose}>
            Close
          </button>
        </div>
      </div>
    ));
  };

  const showMultiple = () => {
    toast("First toast!");
    setTimeout(() => toast.success("Second toast!"), 500);
    setTimeout(() => toast.error("Third toast!"), 1000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Toast Notifications Test Page</h1>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Test Different Toast Types</h2>

          <div className={styles.grid}>
            <button onClick={showToast} className={styles.button}>
              Basic Toast
            </button>

            <button onClick={showSuccess} className={styles.button} data-variant="green">
              Success Toast
            </button>

            <button onClick={showError} className={styles.button} data-variant="red">
              Error Toast
            </button>

            <button onClick={showLoading} className={styles.button} data-variant="blue">
              Loading Toast (2s)
            </button>

            <button onClick={showPromise} className={styles.button} data-variant="purple">
              Promise Toast (50/50)
            </button>

            <button onClick={showCustom} className={styles.button} data-variant="indigo">
              Custom Toast
            </button>

            <button onClick={showMultiple} className={styles.button} data-variant="yellow">
              Multiple Toasts
            </button>

            <button onClick={() => toast.dismiss()} className={styles.button} data-variant="gray-muted">
              Dismiss All
            </button>
          </div>
        </div>

        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>How to use from anywhere</h3>
          <pre className={styles.codeBlock}>
            <code>{`import toast from "react-hot-toast";

// Basic usage
toast("Hello World");
toast.success("Success!");
toast.error("Error!");
toast.loading("Loading...");

// With promise
toast.promise(myPromise, {
  loading: 'Loading...',
  success: 'Success!',
  error: 'Error!',
});`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import styles from "../Settings.module.css";

export default function AccountTab() {
  const { user } = useAuthStore();

  if (!user) {
    return <div className="text-center text-text-secondary py-8">Loading user information...</div>;
  }

  return (
    <div className={styles.settingsContent}>
      <div className={styles.settingItem}>
        <h3>Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Name</label>
            <input
              type="text"
              value={user.name || ""}
              className="ui-input w-full"
              placeholder="Enter your name"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Username</label>
            <input
              type="text"
              value={user.username || ""}
              className="ui-input w-full"
              placeholder="Enter your username"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Email</label>
            <input
              type="email"
              value={user.email || ""}
              className="ui-input w-full"
              placeholder="Enter your email"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className={styles.settingItem}>
        <h3>Security</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Password</label>
            <div className="flex gap-2">
              <input
                type="password"
                value="••••••••"
                className="ui-input flex-1"
                readOnly
              />
              <button className="ui-btn ui-btn-secondary">Change Password</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.settingItem}>
        <h3>Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Language</label>
            <select className="ui-select w-full" defaultValue="en">
              <option value="en">English</option>
              <option value="es" disabled>Spanish (Coming Soon)</option>
              <option value="fr" disabled>French (Coming Soon)</option>
              <option value="de" disabled>German (Coming Soon)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
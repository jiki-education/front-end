"use client";

import type { UserSettings } from "@/lib/api/types/settings";
import Select from "@/components/ui/Select";
import styles from "../Settings.module.css";

interface PreferencesSectionProps {
  settings: UserSettings;
  updateLocale: (locale: string) => Promise<void>;
}

export default function PreferencesSection({ settings, updateLocale }: PreferencesSectionProps) {
  const handleLocaleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await updateLocale(e.target.value);
  };

  return (
    <div className={styles.settingItem}>
      <h3>Preferences</h3>
      <div className="space-y-16 ui-form-field-large">
        <Select
          label="Language"
          value={settings.locale || "en"}
          onChange={handleLocaleChange}
          helperText="Note: Only English is currently fully supported. Other languages coming soon."
          disabled
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
        </Select>
      </div>
    </div>
  );
}

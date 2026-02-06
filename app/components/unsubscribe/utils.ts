export function formatKeyName(key: string): string {
  const names: Record<string, string> = {
    newsletters: "product updates",
    event_emails: "event notifications",
    milestone_emails: "achievement notifications",
    activity_emails: "activity emails"
  };
  return names[key] || "these";
}

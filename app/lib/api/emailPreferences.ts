"use client";

/**
 * Email Preferences API
 * API functions for external email preferences management (unsubscribe flow)
 */

import { api } from "./client";

export interface EmailPreferences {
  newsletters: boolean;
  event_emails: boolean;
  milestone_emails: boolean;
  activity_emails: boolean;
}

interface EmailPreferencesResponse {
  preferences: EmailPreferences;
}

export async function getEmailPreferences(token: string): Promise<EmailPreferences> {
  const response = await api.get<EmailPreferencesResponse>(`/external/email_preferences/${token}`, undefined, false);
  return response.data.preferences;
}

export async function updateEmailPreference(token: string, key: string, value: boolean): Promise<EmailPreferences> {
  const response = await api.patch<EmailPreferencesResponse>(
    `/external/email_preferences/${token}`,
    { [key]: value },
    undefined,
    false
  );
  return response.data.preferences;
}

export async function unsubscribeAll(token: string): Promise<EmailPreferences> {
  const response = await api.post<EmailPreferencesResponse>(
    `/external/email_preferences/${token}/unsubscribe_all`,
    undefined,
    undefined,
    false
  );
  return response.data.preferences;
}

export async function subscribeAll(token: string): Promise<EmailPreferences> {
  const response = await api.post<EmailPreferencesResponse>(
    `/external/email_preferences/${token}/subscribe_all`,
    undefined,
    undefined,
    false
  );
  return response.data.preferences;
}

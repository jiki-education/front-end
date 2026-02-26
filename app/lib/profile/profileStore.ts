import { create } from "zustand";

interface ProfileStore {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

export const useProfileStore = create<ProfileStore>()((set) => ({
  avatarUrl: null,
  setAvatarUrl: (url) => set({ avatarUrl: url })
}));

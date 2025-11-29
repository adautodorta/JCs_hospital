import {create} from "zustand";

interface RoleStore {
  role: string;
  setRole: (newRole: string) => void;
}

export const useRoleStore = create<RoleStore>(set => ({
  role: "patient",
  setRole: (newRole) => {
    set({role: newRole});
  },
}));

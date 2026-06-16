import { defineStore } from "pinia";

/**
 * Auth / session store. Persisted to localStorage (key "myStore") so a page
 * reload keeps the user signed in until the token expires or they log out.
 *
 * Field reference:
 *   accessToken — Bearer JWT
 *   userId      — numeric primary key in user_account
 *   username    — login id (sent to backend as the JWT subject)
 *   fullName    — display name
 *   role        — "ADMIN" or "WORKER" — drives admin-only UI gates
 *   roleId      — permission_group_id
 *   roleName    — permission_group.name (denormalised for display)
 *   permissions — flat list of permission tokens for the user's group
 */
export const myStore = defineStore("myStore", {
  state: () => ({
    accessToken: "",
    userId: "",
    username: "",
    fullName: "",
    role: "",
    roleId: null,
    roleName: "",
    permissions: [],
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.role === "ADMIN",
  },
  persist: true,
});

/**
 * Permission store. Holds the {moduleName}{Read|Write|Delete} flag map the
 * rest of the UI checks (e.g. v-if="permissions.case_managementWrite").
 *
 * The map is rebuilt from a flat list of permission tokens like
 * ["CASE_MANAGEMENT_READ", "ACCOUNT_MANAGEMENT_WRITE"] — that's what the
 * backend returns on login.
 */
export const usePermissionStore = defineStore("permissionStore", {
  state: () => ({
    permissions: {},
  }),
  actions: {
    /**
     * Build the flag map from a flat list of MODULE_ACTION tokens.
     * MODULE chunks are joined by underscores in the source token; the final
     * underscore separates the action from the module name.
     */
    setFromTokens(tokens) {
      const next = {};
      (tokens || []).forEach((token) => {
        const lastUnderscore = token.lastIndexOf("_");
        if (lastUnderscore <= 0) return;
        const module = token.substring(0, lastUnderscore).toLowerCase();
        const action = token.substring(lastUnderscore + 1).toLowerCase();
        const key = `${module}${action.charAt(0).toUpperCase()}${action.slice(1)}`;
        next[key] = true;
      });
      this.permissions = next;
    },

    /**
     * Legacy path: receives [{elementId, actionType}] from older code paths.
     * Retained for backwards compatibility with components that haven't been
     * migrated to the flat-token shape yet.
     */
    parsePermissions(data) {
      const perms = {};
      (data || []).forEach((group) => {
        const baseKey = group.elementId.replace(/-/g, "_").toLowerCase();
        perms[`${baseKey}Read`] = group.actionType.includes("READ");
        perms[`${baseKey}Write`] = group.actionType.includes("WRITE");
        perms[`${baseKey}Delete`] = group.actionType.includes("DELETE");
      });
      return perms;
    },
  },
});

// Used by PermissionsDetail to trigger a refresh of the account list after
// a group rename / permission change ripples through.
export const useAccountStore = defineStore("accountStore", {
  state: () => ({
    needAccountRefresh: false,
  }),
  actions: {
    setNeedAccountRefresh(status) {
      this.needAccountRefresh = status;
    },
  },
});

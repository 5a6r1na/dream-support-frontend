// apis.js — single source of truth for backend HTTP calls.
//
// Base URL is read from the Vite environment (see .env / .env.production).
// All endpoints are mounted under <baseURL>/... so individual functions never
// hard-code hosts or ports.

import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";
import { myStore, usePermissionStore } from "../stores/index";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

const instance = axios.create({ baseURL });

// Attach Bearer token (when present) to every outgoing request.
instance.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("myStore");
      if (raw) {
        const token = JSON.parse(raw).accessToken;
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("apis.js: malformed myStore in localStorage", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// HTTP error handling:
//   401 on a non-/auth endpoint → token is invalid / expired → log the user
//                                 out and bounce to /login.
//   401 on /auth/login itself   → just a wrong-credentials response; let the
//                                 caller surface its own message, don't touch
//                                 the session.
//   403                         → user is logged in but lacks permission for
//                                 this specific request. Surface a toast and
//                                 keep the session intact (do NOT log out).
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isAuthCall = url.includes("/auth/");

    if (status === 401 && !isAuthCall) {
      try {
        const store = myStore();
        store.$patch({
          accessToken: "",
          userId: "",
          username: "",
          fullName: "",
          role: "",
          roleId: null,
          roleName: "",
          permissions: [],
        });
        usePermissionStore().setFromTokens([]);
      } catch (_) { /* store may not be initialised yet */ }
      localStorage.removeItem("myStore");
      if (router.currentRoute.value.path !== "/login") {
        router.push("/login");
      }
    } else if (status === 403) {
      // Use the backend's localised message when present; otherwise a generic
      // Chinese fallback. Important: we do NOT clear the token or redirect —
      // the user is still legitimately logged in, they just can't perform
      // this particular action.
      const msg = error?.response?.data?.message || "您沒有執行此操作的權限";
      try { ElMessage.warning(msg); } catch (_) { /* DOM may not be ready */ }
    }
    return Promise.reject(error);
  }
);

// ----- Case management -----
export const queryCases = (data) => instance.post(`/case/queryCases`, data);
export const getCaseProfile = (data) => instance.post(`/case/getCaseProfile`, data);
export const createCaseProfile = (data) => instance.post(`/case/createCaseProfile`, data);
export const updateCaseProfile = (data) => instance.post(`/case/updateCaseProfile`, data);
export const deleteCaseProfile = (data) => instance.post(`/case/deleteCaseProfile`, data);
export const getCaseBackground = (data) => instance.post(`/case/getCaseBackground`, data);
export const updateCaseBackground = (data) => instance.post(`/case/updateCaseBackground`, data);
export const createCaseHistory = (data) => instance.post(`/case/createCaseHistory`, data);
export const getCaseHistory = (data) => instance.post(`/case/getCaseHistory`, data);
export const deleteCaseHistories = (data) => instance.post(`/case/deleteCaseHistories`, data);
export const downloadCaseApplications = (data) =>
  instance.post(`/case/downloadCaseApplications`, data, { responseType: "blob" });

// ----- Sponsor management -----
export const querySponsorProjects = (data) => instance.post(`/sponsor/querySponsorProjects`, data);
export const createSponsorProject = (data) =>
  instance.post(`/sponsor/createSponsorProject`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateSponsorProject = (data) => instance.post(`/sponsor/updateSponsorProject`, data);
export const updateSponsorProjectFile = (data) =>
  instance.post(`/sponsor/updateSponsorProjectFile`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteSponsorProjects = (data) => instance.post(`/sponsor/deleteSponsorProjects`, data);
export const querySponsorSuccessRate = (data) => instance.post(`/sponsor/querySponsorSuccessRate`, data);
export const downloadOriginalApplication = (data) =>
  instance.post(`/sponsor/downloadOriginalApplication`, data, { responseType: "blob" });

// ----- Account / permissions (UI exists but backend is not implemented yet)  -----
// These endpoints intentionally route to /system/account/* on the same backend.
// They will start working once the matching controllers are added; until then
// they return 404 and the calling components fall back to mock data in dev.
export const queryAccounts = (data) => instance.post(`/system/account/queryAccounts`, data);
export const createAccount = (data) => instance.post(`/system/account/createAccount`, data);
export const updateAccount = (data) => instance.post(`/system/account/updateAccount`, data);
export const updateAccounts = (data) => instance.post(`/system/account/updateAccounts`, data);
export const deleteAccount = (data) => instance.post(`/system/account/deleteAccount`, data);
export const queryPermissionGroups = (data) => instance.post(`/system/account/queryPermissionGroups`, data);
export const createPermissionGroup = (data) => instance.post(`/system/account/createPermissionGroup`, data);
export const updatePermissionGroup = (data) => instance.post(`/system/account/updatePermissionGroup`, data);
export const deletePermissionGroup = (data) => instance.post(`/system/account/deletePermissionGroup`, data);
export const getPermissionList = (data) => instance.post(`/system/account/getPermissionList`, data);
export const getPermissionGroupList = (data) => instance.post(`/system/account/getPermissionGroupList`, data);
export const toggleAccountStatus = (data) => instance.post(`/system/account/toggleAccountStatus`, data);
export const queryAuditLog = (data) => instance.post(`/system/account/queryAuditLog`, data);

// ----- Authentication -----
//
// Login posts { username, password } and receives an ApiBaseResponse whose
// body.data is { token, userId, username, fullName, expiresAt }. On success we
// persist the token to localStorage via the Pinia store and resolve to the
// response so the caller can react (toast, redirect, etc.).
//
// Logout is best-effort: we ask the server to acknowledge, then clear local
// state regardless of the server's response. Failures here should not block
// the user from being signed out client-side.
export default {
  loginAction: async ({ username, password }) => {
    const response = await instance.post(`/auth/login`, { username, password });
    const payload = response?.data?.data;
    if (!payload || !payload.token) {
      throw new Error(response?.data?.message || "Login failed");
    }

    const persisted = {
      accessToken: payload.token,
      userId: payload.userId,
      username: payload.username,
      fullName: payload.fullName,
      role: payload.role,
      roleId: payload.roleId,
      roleName: payload.roleName,
      permissions: payload.permissions || [],
    };

    myStore().$patch(persisted);
    // Build the {moduleName}{Read|Write|Delete} permission map the rest of
    // the UI consults via usePermissionStore.permissions.
    usePermissionStore().setFromTokens(payload.permissions || []);

    localStorage.setItem("myStore", JSON.stringify(persisted));
    return response;
  },

  logoutAction: async () => {
    try {
      await instance.post(`/auth/logout`);
    } catch (e) {
      // Stateless logout — server failure is non-fatal for the client.
      console.warn("logout request failed, clearing client state anyway", e);
    }
    try {
      const store = myStore();
      store.$patch({
        accessToken: "",
        userId: "",
        username: "",
        fullName: "",
        role: "",
        roleId: null,
        roleName: "",
        permissions: [],
      });
      usePermissionStore().setFromTokens([]);
    } catch (_) { /* noop */ }
    localStorage.removeItem("myStore");
  },
};

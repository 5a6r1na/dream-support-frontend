import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import CaseManagement from "../pages/CaseManagement.vue";
import AccountManagement from "../pages/AccountManagement.vue";
import SponsorManagement from "../pages/SponsorManagement.vue";

// Route metadata:
//   meta.public             — true if reachable without a session
//   meta.requireAdmin       — true if role must be ADMIN
//   meta.requiresPermission — permission token the user must hold
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login, meta: { public: true } },
  {
    path: "/CaseManagement",
    component: CaseManagement,
    meta: { requiresPermission: "CASE_MANAGEMENT_READ" },
  },
  {
    path: "/SponsorManagement",
    component: SponsorManagement,
    meta: { requiresPermission: "SPONSOR_MANAGEMENT_READ" },
  },
  {
    path: "/AccountManagement",
    component: AccountManagement,
    meta: { requireAdmin: true, requiresPermission: "ACCOUNT_MANAGEMENT_READ" },
  },
  // Catch-all keeps stray URLs from rendering blank. Sends users home.
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// We read the persisted store straight from localStorage so this guard works
// before Pinia is installed on the app (first navigation runs very early).
function readPersistedStore() {
  try {
    const raw = localStorage.getItem("myStore");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

/**
 * Pick the first route the user has permission to visit, so we can redirect
 * to it instead of bouncing to /login when permission is denied.
 */
function firstAccessibleRoute(perms, role) {
  if (perms.includes("CASE_MANAGEMENT_READ"))    return "/CaseManagement";
  if (perms.includes("SPONSOR_MANAGEMENT_READ")) return "/SponsorManagement";
  if (role === "ADMIN" && perms.includes("ACCOUNT_MANAGEMENT_READ")) return "/AccountManagement";
  return null;
}

router.beforeEach((to) => {
  if (to.meta?.public) return true;

  const session = readPersistedStore();
  const token = session?.accessToken || "";

  if (!token) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  const permissions = Array.isArray(session?.permissions) ? session.permissions : [];
  const role = session?.role || "";

  // Admin-only gate (independent of the fine-grained permission check below).
  if (to.meta?.requireAdmin && role !== "ADMIN") {
    const fallback = firstAccessibleRoute(permissions, role);
    return fallback ? { path: fallback } : { path: "/login" };
  }

  // Fine-grained permission gate.
  if (to.meta?.requiresPermission && !permissions.includes(to.meta.requiresPermission)) {
    const fallback = firstAccessibleRoute(permissions, role);
    // Avoid an infinite redirect loop if the user has no accessible page.
    if (!fallback || fallback === to.path) {
      return { path: "/login" };
    }
    return { path: fallback };
  }

  return true;
});

export default router;

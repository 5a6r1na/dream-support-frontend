// permissionLabels.js
// Maps backend permission tokens (e.g. CASE_MANAGEMENT_WRITE) and group names
// (Admin, Worker, ReadOnly) to the Traditional Chinese strings shown in the UI.
// Tokens themselves remain in English so they round-trip through the API.

export const PERMISSION_LABELS = {
  CASE_MANAGEMENT_READ:    "個案管理 - 查詢",
  CASE_MANAGEMENT_WRITE:   "個案管理 - 編輯",
  CASE_MANAGEMENT_DELETE:  "個案管理 - 刪除",
  SPONSOR_MANAGEMENT_READ:   "補助管理 - 查詢",
  SPONSOR_MANAGEMENT_WRITE:  "補助管理 - 編輯",
  SPONSOR_MANAGEMENT_DELETE: "補助管理 - 刪除",
  ACCOUNT_MANAGEMENT_READ:   "帳號管理 - 查詢",
  ACCOUNT_MANAGEMENT_WRITE:  "帳號管理 - 編輯",
  ACCOUNT_MANAGEMENT_DELETE: "帳號管理 - 刪除",
};

export const ROLE_GROUP_LABELS = {
  Admin:    "管理員",
  Worker:   "一般使用者",
  ReadOnly: "唯讀",
};

export const ROLE_LABELS = {
  ADMIN:  "管理員",
  WORKER: "一般使用者",
};

/** Look up the label for a permission token; fall back to the token itself. */
export function permissionLabel(token) {
  return PERMISSION_LABELS[token] || token;
}

/** Look up the label for a permission group name; fall back to the raw name. */
export function groupLabel(name) {
  return ROLE_GROUP_LABELS[name] || name;
}

/** Look up the label for the coarse role (ADMIN / WORKER). */
export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}

/**
 * el-tag colour for a permission action. READ = info (藍綠), WRITE = warning
 * (橘), DELETE = danger (紅). Anything unrecognised falls back to grey.
 */
export function permissionTagType(token) {
  if (typeof token !== "string") return "info";
  if (token.endsWith("_READ"))   return "info";
  if (token.endsWith("_WRITE"))  return "warning";
  if (token.endsWith("_DELETE")) return "danger";
  return "";
}

/** Format an OffsetDateTime / ISO string as "YYYY/MM/DD HH:mm" in zh-TW. */
export function formatDateTime(isoString) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "—";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch (_) {
    return "—";
  }
}

/**
 * Human label for an action recorded in audit_log.
 */
export const AUDIT_ACTION_LABELS = {
  ACCOUNT_CREATE:           "新增帳號",
  ACCOUNT_UPDATE:           "編輯帳號",
  ACCOUNT_DELETE:           "刪除帳號",
  ACCOUNT_STATUS_TOGGLE:    "切換帳號狀態",
  PERMISSION_GROUP_CREATE:  "新增權限群組",
  PERMISSION_GROUP_UPDATE:  "編輯權限群組",
  PERMISSION_GROUP_DELETE:  "刪除權限群組",
};

export function auditActionLabel(action) {
  return AUDIT_ACTION_LABELS[action] || action || "—";
}

/** Status display: ACTIVE → 啟用, DISABLED → 停用, EXPIRE → 已刪除. */
export function statusLabel(status) {
  switch (status) {
    case "ACTIVE":   return "啟用";
    case "DISABLED": return "停用";
    case "EXPIRE":   return "已刪除";
    default:         return status || "—";
  }
}
export function statusTagType(status) {
  switch (status) {
    case "ACTIVE":   return "success";
    case "DISABLED": return "info";
    case "EXPIRE":   return "danger";
    default:         return "";
  }
}

// apiSwitch.js — dispatch table over the named endpoints in services/apis.js.
// Components call apiSwitch("<endpoint name>", payload) instead of importing
// each function individually; this keeps refactors local to this file.

import {
  // case
  queryCases,
  getCaseProfile,
  createCaseProfile,
  updateCaseProfile,
  deleteCaseProfile,
  getCaseBackground,
  updateCaseBackground,
  createCaseHistory,
  getCaseHistory,
  deleteCaseHistories,
  downloadCaseApplications,
  // sponsor
  querySponsorProjects,
  createSponsorProject,
  updateSponsorProject,
  updateSponsorProjectFile,
  deleteSponsorProjects,
  querySponsorSuccessRate,
  downloadOriginalApplication,
  // account / permission (UI-only until backend ships)
  queryAccounts,
  createAccount,
  updateAccount,
  updateAccounts,
  deleteAccount,
  queryPermissionGroups,
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
  getPermissionList,
  getPermissionGroupList,
  toggleAccountStatus,
  queryAuditLog,
} from "../services/apis";

const dispatch = {
  // case
  queryCases,
  getCaseProfile,
  createCaseProfile,
  updateCaseProfile,
  deleteCaseProfile,
  getCaseBackground,
  updateCaseBackground,
  createCaseHistory,
  getCaseHistory,
  deleteCaseHistories,
  downloadCaseApplications,
  // sponsor
  querySponsorProjects,
  createSponsorProject,
  updateSponsorProject,
  updateSponsorProjectFile,
  deleteSponsorProjects,
  querySponsorSuccessRate,
  downloadOriginalApplication,
  // account / permission
  queryAccounts,
  createAccount,
  updateAccount,
  updateAccounts,
  deleteAccount,
  queryPermissionGroups,
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
  getPermissionList,
  getPermissionGroupList,
  toggleAccountStatus,
  queryAuditLog,
};

export const apiSwitch = async (apiKey, req) => {
  const fn = dispatch[apiKey];
  if (!fn) {
    console.warn(`apiSwitch: unknown endpoint "${apiKey}"`);
    return {};
  }
  return fn(req);
};

//apiSwitch.js
import {
  getProjectList,
  queryCases,
  getCaseProfile,
  createCaseProfile,
  updateCaseProfile,
  deleteCaseProfile,
  getCaseBackground,
  createCaseBackground,
  updateCaseBackground,
  querySponsorProjects,
  updateSponsorProject,
  deleteSponsorProjects,
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
} from "../services/apis";

export const apiSwitch = async (apiKey, req) => {
  let res = {};
  try {
    switch (apiKey) {
      //個案管理
      case "getProjectList":
        res = await getProjectList(req);
        break;
      case "queryCases":
        res = await queryCases(req);
        break;
      case "getCaseProfile":
        res = await getCaseProfile(req);
        break;
      case "createCaseProfile":
        res = await createCaseProfile(req);
        break;
      case "updateCaseProfile":
        res = await updateCaseProfile(req);
        break;
      case "deleteCaseProfile":
        res = await deleteCaseProfile(req);
        break;
      case "getCaseBackground":
        res = await getCaseBackground(req);
        break;
      case "createCaseBackground":
        res = await createCaseBackground(req);
        break;
      case "updateCaseBackground":
        res = await updateCaseBackground(req);
        break;

      case "downloadApplications":
        res = await downloadApplications(req);
        break;

      // 補助方案管理模組
      case "querySponsorProjects":
        res = await querySponsorProjects(req);
        break;

      case "updateSponsorProject":
        res = await updateSponsorProject(req);
        break;

      case "deleteSponsorProjects":
        res = await deleteSponsorProjects(req);
        break;

      // //爬蟲日誌
      // case "queryCrawlerLogs":
      //   res = await queryCrawlerLogs(req);
      //   break;
      // case "getCrawlerNameList":
      //   res = await getCrawlerNameList(req);
      //   break;

      //帳號管理模組
      //系統管理模組(帳號)
      case "queryAccounts":
        res = await queryAccounts(req);
        break;
      case "createAccount":
        res = await createAccount(req);
        break;
      case "updateAccount":
        res = await updateAccount(req);
        break;
      case "updateAccounts":
        res = await updateAccounts(req);
        break;
      case "deleteAccount":
        res = await deleteAccount(req);
        break;

      //系統管理模組(權限群組)
      case "queryPermissionGroups":
        res = await queryPermissionGroups(req);
        break;
      case "createPermissionGroup":
        res = await createPermissionGroup(req);
        break;
      case "updatePermissionGroup":
        res = await updatePermissionGroup(req);
        break;
      case "deletePermissionGroup":
        res = await deletePermissionGroup(req);
        break;
      case "getPermissionList":
        res = await getPermissionList(req);
        break;
      case "getPermissionGroupList":
        res = await getPermissionGroupList(req);
        break;

      default:
    }
    // console.error('res', res);
  } catch (error) {
    throw error;
  } finally {
    // console.error('res', res);
  }
  return res;
};

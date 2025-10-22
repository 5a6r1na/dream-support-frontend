//apis.js
import axios from "axios";
import qs from "qs";

const serverDomain = window.VITE_APP_HDRE_API;
const serverAuthDomain = window.VITE_APP_HDRE_API_AUTH;

const baseURL = "http://localhost:8081/api";
const instance = axios.create({
  baseURL: baseURL,
});

import { myStore } from "../stores/index";

//個案管理模組

// 1.補助清單列表，查詢資料
export const getProjectList = (data) => {
  return instance.post(
    `http://localhost:5173/api/case/getProjectList`,
    // `http://localhost:8080/system/account/getProjectList`,
    // `${serverDomain}/system/account/getProjectList`,
    data
  );
};

// 1.個案列表，查詢資料
export const queryCases = (data) => {
  return instance.post(
    // `http://localhost:5173/api/case/queryCases`,
    `http://localhost:8081/api/case/queryCases`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

// 2.個案基本資料，查詢資料
export const getCaseProfile = (data) => {
  return instance.post(
    // `http://localhost:5173/api/case/getCaseProfile`,
    `http://localhost:8081/api/case/getCaseProfile`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

// 3.個案基本資料，建立資料
export const createCaseProfile = (data) => {
  return instance.post(
    // `http://localhost:5173/api/case/createCaseProfile`,
    `http://localhost:8081/api/case/createCaseProfile`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

// 4.個案基本資料，更新資料
export const updateCaseProfile = (data) => {
  return instance.post(
    // `http://localhost:5173/api/case/updateCaseProfile`,
    `http://localhost:8081/api/case/updateCaseProfile`,
    // `${serverDomain}/system/account/updateCaseProfile`,
    data
  );
};

// 4.個案基本資料，刪除資料
export const deleteCaseProfile = (data) => {
  return instance.post(
    // `http://localhost:5173/api/case/deleteCaseProfile`,
    `http://localhost:8081/api/case/deleteCaseProfile`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

// 5.個案背景資料，查詢資料
export const getCaseBackground = (data) => {
  return instance.post(
    `http://localhost:8081/api/case/getCaseBackground`,
    // `http://localhost:8080/system/account/queryAccounts`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

// 6.個案背景資料，建立資料
export const createCaseBackground = (data) => {
  return instance.post(
    `http://localhost:5173/api/case/createCaseBackground`,
    // `http://localhost:8080/system/account/queryAccounts`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

// 7.個案背景資料，更新資料
export const updateCaseBackground = (data) => {
  return instance.post(
    `http://localhost:8081/api/case/updateCaseBackground`,
    // `http://localhost:8080/system/account/queryAccounts`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

// 9.下載補助方案申請表
// export const downloadApplications = (data) => {
//   return instance.post(
//     // `http://localhost:5173/api/case/downloadApplications`,
//     `http://localhost:8081/api/case/downloadApplications`,
//     // `${serverDomain}/system/account/queryAccounts`,
//     data
//   );
// };

// 補助方案管理模組
// 8.補助方案列表，查詢資料
export const querySponsorProjects = (data) => {
  return instance.post(
    // `http://localhost:5173/api/sponsor/querySponsorProjects`,
    `http://localhost:8081/api/sponsor/querySponsorProjects`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

export const updateSponsorProject = (data) => {
  return instance.post(
    // `http://localhost:5173/api/sponsor/updateSponsorProject`,
    `http://localhost:8081/api/sponsor/updateSponsorProject`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

// 4.個案基本資料，刪除資料
export const deleteSponsorProjects = (data) => {
  return instance.post(
    // `http://localhost:5173/api/case/deleteCaseProfile`,
    `http://localhost:8081/api/sponsor/deleteSponsorProjects`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};

//帳號管理模組
// 31.帳號列表，查詢資料
export const queryAccounts = (data) => {
  return instance.post(
    `http://localhost:5173/api/system/account/queryAccounts`,
    // `http://localhost:8080/system/account/queryAccounts`,
    // `${serverDomain}/system/account/queryAccounts`,
    data
  );
};
// 32.帳號列表，新增資料
export const createAccount = (data) => {
  return instance.post(
    // `http://localhost:5173/api/system/account/createAccount`,
    `http://localhost:8080/system/account/createAccount`,
    // `${serverDomain}/system/account/createAccount`,
    data
  );
};
// 33.帳號列表，更新資料
export const updateAccount = (data) => {
  return instance.post(
    // `http://localhost:5173/api/system/account/updateAccount`,
    // `${serverDomain}/system/account/updateAccount`,
    `http://localhost:8080/system/account/updateAccount`,

    data
  );
};
//34.多筆更新資料權限群組
export const updateAccounts = (data) => {
  return instance.post(
    // `http://localhost:5173/api/system/account/updateAccounts`,
    `http://localhost:8080/system/account/updateAccounts`,
    // `${serverDomain}/system/account/updateAccounts`,
    data
  );
};
//35.帳號列表，刪除資料
export const deleteAccount = (data) => {
  return instance.post(
    // `http://localhost:5173/api/system/account/deleteAccount`,
    `http://localhost:8080/system/account/deleteAccount`,
    // `${serverDomain}/system/account/deleteAccount`,
    data
  );
};
// 36.權限群組列表，查詢資料
export const queryPermissionGroups = (data) => {
  return instance.post(
    `http://localhost:5173/api/system/account/queryPermissionGroups`,
    // `${serverDomain}/system/account/queryPermissionGroups`,
    // `http://localhost:8080/system/account/queryPermissionGroups`,

    data
  );
};
// 37.權限群組列表，新增資料
export const createPermissionGroup = (data) => {
  return instance.post(
    `http://localhost:5173/api/system/account/createPermissionGroup`,
    // `http://localhost:8080/system/account/createPermissionGroup`,
    // `${serverDomain}/system/account/createPermissionGroup`,
    data
  );
};
// 38.權限群組列表，更新資料
export const updatePermissionGroup = (data) => {
  return instance.post(
    // `http://localhost:5173/api/system/account/updatePermissionGroup`,
    `http://localhost:8080/system/account/updatePermissionGroup`,
    // `${serverDomain}/system/account/updatePermissionGroup`,
    data
  );
};
// 39.權限群組列表，刪除資料
export const deletePermissionGroup = (data) => {
  return instance.post(
    // `http://localhost:5173/api/system/account/deletePermissionGroup`,
    `http://localhost:8080/system/account/deletePermissionGroup`,
    // `${serverDomain}/system/account/deletePermissionGroup`,
    data
  );
};
// 40. [查詢] 權限下拉項目【單筆】
export const getPermissionList = (data) => {
  return instance.post(
    `http://localhost:5173/api/system/account/getPermissionList`,
    // `http://localhost:8080/system/account/getPermissionList`,
    // `${serverDomain}/system/account/getPermissionList`,
    data
  );
};
// 41. [查詢] 權限群組下拉項目【單筆】
export const getPermissionGroupList = (data) => {
  return instance.post(
    `http://localhost:5173/api/system/account/getPermissionGroupList`,
    // `http://localhost:8080/system/account/getPermissionGroupList`,
    // `${serverDomain}/system/account/getPermissionGroupList`,
    data
  );
};

//42. 登入
//43. 登出
instance.interceptors.request.use(
  (config) => {
    const storeData = localStorage.getItem("myStore");
    let token = "";

    try {
      if (storeData) {
        const storeDataJson = JSON.parse(storeData);
        token = storeDataJson["accessToken"];
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("localStorage is not a valid JSON!");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // localStorage.removeItem("myStore");
    router.push(`/login`);

    return Promise.reject(error);
  }
);

export default {
  loginAction: async (reqBody) => {
    try {
      const response = await instance.post(
        `http://localhost:8080/auth/login`,
        reqBody
      );
      console.log("API 回應:", response); // 檢查 API 的完整回應

      // if (response.data && response.data.status) {
      if (response.data) {
        // 假設後端返回的是 token 和 userId
        const accessToken = response.data.token;
        const userId = response.data.userId; // 如果 response 中包含 userId

        // 將 accessToken 和 userId 保存到 store
        const store = myStore();
        store.$patch({
          accessToken: accessToken,
          userId: userId,
        });

        // 將 accessToken 和 userId 保存到 localStorage
        const storeData = {
          accessToken: accessToken,
          userId: userId,
        };

        localStorage.setItem("myStore", JSON.stringify(storeData));
        console.log("成功儲存到 localStorage 和 myStore");

        return response;
      } else {
        throw new Error("登入失敗");
      }
    } catch (error) {
      console.error("API 請求失敗:", error);
      throw error;
    }
  },
  logoutAction: () => {
    return instance.post(`${serverAuthDomain}/logout`);
  },
};

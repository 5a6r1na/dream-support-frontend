// mock/index.js
import Mock from "mockjs";

// ====================================== 個案管理 ======================================
// 取得補助清單
Mock.mock(
  "http://localhost:5173/api/case/getProjectList",
  "post",
  (options) => {
    console.log("mock 攔截/getProjectList", options);
    return {
      code: "SUCCESS",
      data: [
        {
          projectId: "100001",
          projectName: "台北市天后宮急難救助金",
          projectType: "1",
          projectUrl: "http://xn--djrpt1c90vgrd.tw/charity_02.html",
        },
        {
          projectId: "100002",
          projectName: "台北市天后宮獎助學金",
          projectType: "2",
          projectUrl: "http://xn--djrpt1c90vgrd.tw/charity_02.html",
        },
        {
          projectId: "100003",
          projectName: "中華民國善願愛心協會急難救助金",
          projectType: "1",
          projectUrl: "http://www.goodwill.org.tw/ContentAspx/index.aspx",
        },
      ],
      message: "成功",
    };
  }
);
// 取得個案列表
Mock.mock("http://localhost:5173/api/case/queryCases", "post", (options) => {
  console.log("mock 攔截/queryCases", options);
  return {
    code: "SUCCESS",
    data: [
      {
        id: "100001",
        fullName: "王小明",
        caseType: "lowincome",
      },
      {
        id: "100002",
        fullName: "李大名",
        caseType: "veteran",
      },
    ],
    message: "成功",
  };
});

// 取得個案基本資料
Mock.mock(
  "http://localhost:5173/api/case/getCaseProfile",
  "post",
  (options) => {
    console.log("mock 攔截/getCaseDetail", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        lastName: "王",
        firstName: "小明",
        gender: "M",
        birthYear: "1996",
        birthYearROC: "85",
        birthMonth: "1",
        birthDay: "21",
        mobileNum: "0912345678",
        landlineNum: "0212345678",
        officeNum: "0287654321",
        caseType: "lowincome",
      },
      message: "成功",
    };
  }
);

// 建立個案基本資料
Mock.mock(
  "http://localhost:5173/api/case/createCaseProfile",
  "post",
  (options) => {
    console.log("mock 攔截/createCaseProfile", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        lastName: "王",
        firstName: "小華",
        gender: "M",
        birthYear: "1996",
        birthYearROC: "85",
        birthMonth: "1",
        birthDay: "21",
        mobileNum: "0912345678",
        landlineNum: "0212345678",
        officeNum: "0287654321",
        caseType: "lowincome",
      },
      message: "成功",
    };
  }
);

// 更新個案基本資料
Mock.mock(
  "http://localhost:5173/api/case/updateCaseProfile",
  "post",
  (options) => {
    console.log("mock 攔截/updateCaseProfile", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        lastName: "王",
        firstName: "小華",
        gender: "M",
        birthYear: "1996",
        birthYearROC: "85",
        birthMonth: "1",
        birthDay: "21",
        mobileNum: "0912345678",
        landlineNum: "0212345678",
        officeNum: "0287654321",
        caseType: "lowincome",
      },
      message: "成功",
    };
  }
);

// 取得個案歷史資料
Mock.mock(
  "http://localhost:5173/api/case/getCaseBackground",
  "post",
  (options) => {
    console.log("mock 攔截/getCaseBackground", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        familyIncome: "1",
      },
      message: "成功",
    };
  }
);

// 建立個案背景資料
Mock.mock(
  "http://localhost:5173/api/case/createCaseBackground",
  "post",
  (options) => {
    console.log("mock 攔截/createCaseBackground", options);
    return {
      code: "SUCCESS",
      data: {
        lastName: "王",
        firstName: "小華",
        gender: "M",
        birthYear: "1996",
        birthYearROC: "85",
        birthMonth: "1",
        birthDay: "21",
        mobileNum: "0912345678",
        landlineNum: "0212345678",
        officeNum: "0287654321",
        caseType: "lowincome",
      },
      message: "成功",
    };
  }
);

// 更新個案背景資料
Mock.mock(
  "http://localhost:5173/api/case/updateCaseBackground",
  "post",
  (options) => {
    console.log("mock 攔截/updateCaseBackground", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        familyIncome: "2",
      },
      message: "成功",
    };
  }
);

// ====================================== 補助方案管理 ======================================

// 取得補助列表
Mock.mock(
  "http://localhost:5173/api/sponsor/querySponsorProjects",
  "post",
  (options) => {
    console.log("mock 攔截/querySponsorProjects", options);
    return {
      code: "SUCCESS",
      data: [
        {
          id: "100001",
          name: "台北市天后宮急難救助金",
          type: "1",
          organization: "台北市天后宮",
          url: "http://xn--djrpt1c90vgrd.tw/charity_02.html",
          memo: "abc",
          filepath: "path",
        },
        {
          id: "100002",
          name: "台北市天后宮獎助學金",
          type: "2",
          organization: "台北市天后宮",
          url: "http://xn--djrpt1c90vgrd.tw/charity_02.html",
          memo: "abc",
          filepath: "path",
        },
        {
          id: "100003",
          name: "中華民國善願愛心協會急難救助金",
          type: "1",
          organization: "中華民國善願愛心協會",
          url: "http://www.goodwill.org.tw/ContentAspx/index.aspx",
          memo: "abc",
          filepath: "path",
        },
      ],
      message: "成功",
    };
  }
);

// 取得個案基本資料
Mock.mock(
  "http://localhost:5173/api/case/getCaseProfile",
  "post",
  (options) => {
    console.log("mock 攔截/getCaseDetail", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        lastName: "王",
        firstName: "小明",
        gender: "M",
        birthYear: "1996",
        birthYearROC: "85",
        birthMonth: "1",
        birthDay: "21",
        mobileNum: "0912345678",
        landlineNum: "0212345678",
        officeNum: "0287654321",
        caseType: "lowincome",
      },
      message: "成功",
    };
  }
);

// 建立個案基本資料
Mock.mock(
  "http://localhost:5173/api/case/createCaseProfile",
  "post",
  (options) => {
    console.log("mock 攔截/createCaseProfile", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        lastName: "王",
        firstName: "小華",
        gender: "M",
        birthYear: "1996",
        birthYearROC: "85",
        birthMonth: "1",
        birthDay: "21",
        mobileNum: "0912345678",
        landlineNum: "0212345678",
        officeNum: "0287654321",
        caseType: "lowincome",
      },
      message: "成功",
    };
  }
);

// 更新個案基本資料
Mock.mock(
  "http://localhost:5173/api/case/updateCaseProfile",
  "post",
  (options) => {
    console.log("mock 攔截/updateCaseProfile", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        lastName: "王",
        firstName: "小華",
        gender: "M",
        birthYear: "1996",
        birthYearROC: "85",
        birthMonth: "1",
        birthDay: "21",
        mobileNum: "0912345678",
        landlineNum: "0212345678",
        officeNum: "0287654321",
        caseType: "lowincome",
      },
      message: "成功",
    };
  }
);

// 取得個案歷史資料
Mock.mock(
  "http://localhost:5173/api/case/getCaseBackground",
  "post",
  (options) => {
    console.log("mock 攔截/getCaseBackground", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        familyIncome: "1",
      },
      message: "成功",
    };
  }
);

// 建立個案背景資料
Mock.mock(
  "http://localhost:5173/api/case/createCaseBackground",
  "post",
  (options) => {
    console.log("mock 攔截/createCaseBackground", options);
    return {
      code: "SUCCESS",
      data: {
        lastName: "王",
        firstName: "小華",
        gender: "M",
        birthYear: "1996",
        birthYearROC: "85",
        birthMonth: "1",
        birthDay: "21",
        mobileNum: "0912345678",
        landlineNum: "0212345678",
        officeNum: "0287654321",
        caseType: "lowincome",
      },
      message: "成功",
    };
  }
);

// 更新個案背景資料
Mock.mock(
  "http://localhost:5173/api/case/updateCaseBackground",
  "post",
  (options) => {
    console.log("mock 攔截/updateCaseBackground", options);
    return {
      code: "SUCCESS",
      data: {
        caseId: "100001",
        familyIncome: "2",
      },
      message: "成功",
    };
  }
);

// ====================================== 帳號管理 ======================================
//帳號列表
Mock.mock(
  "http://localhost:5173/api/system/account/queryAccounts",
  "post",
  (options) => {
    console.log("mock 攔截/queryAccounts", options);
    return {
      code: "SUCCESS",
      data: [
        {
          userLoginId: "test",
          username: "test123",
          password: "000000",
          name: "測試的人",
          roleName: "管理員",
        },
        {
          userLoginId: "test",
          username: "test456",
          password: "000000",
          name: "測試",
          roleName: "使用者",
        },
      ],
      message: "成功",
    };
  }
);

//權限群組列表
Mock.mock(
  "http://localhost:5173/api/system/account/queryPermissionGroups",
  "post",
  (options) => {
    console.log("mock 攔截/queryPermissionGroups", options);
    return {
      code: "SUCCESS",
      data: [
        {
          roleId: "100000",
          roleName: "管理者",
          permission: [
            "日本電力使用現況",
            "日前市場即時資訊",
            "電力數據分析工具",
            "爬蟲管理",
            "爬蟲日誌",
            "帳號管理",
          ],
        },
        {
          roleId: "100001",
          roleName: "使用者",
          permission: [
            "日本電力使用現況",
            "日前市場即時資訊",
            "電力數據分析工具",
          ],
        },
        {
          roleId: "100002",
          roleName: "測試專員",
          permission: ["爬蟲日誌"],
        },
      ],
      message: "成功",
    };
  }
);

//權限下拉
Mock.mock(
  "http://localhost:5173/api/system/account/getPermissionList",
  "post",
  (options) => {
    console.log("mock 攔截/getPermissionList", options);
    return {
      code: "SUCCESS",
      data: [
        {
          permission: [
            "日本電力使用現況",
            "日前市場即時資訊",
            "電力數據分析工具",
            "爬蟲管理",
            "爬蟲日誌",
            "帳號管理",
          ],
        },
      ],
      message: "成功",
    };
  }
);

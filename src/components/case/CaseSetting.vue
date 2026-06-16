<!--CaseSetting.vue -->
<template>
  <div
    style="display: flex; justify-content: space-between; padding-bottom: 10px"
  >
    <div style="flex: 1">
      <el-button
        v-if="perms.case_managementWrite"
        type="primary"
        @click="openDialog"
      >
        新增個案
      </el-button>
    </div>
  </div>

  <el-dialog v-model="dialogFormVisible" @close="closeDialog" top="5vh">
    <h1 style="padding: 10px 20px 25px 20px">新增個案</h1>
    <div class="dialog-content">
      <!-- 個案設定 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="form-section"
        style="width: 100%"
      >
        <div>
          <div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                gap: 30px;
                width: 100%;
              "
            >
              <el-form-item
                label="姓"
                prop="lastName"
                :label-width="formLabelWidth"
                label-position="top"
                style="flex: 1"
              >
                <el-input
                  v-model="form.lastName"
                  autocomplete="off"
                  placeholder="請輸入個案姓"
                  :disabled="isDisabled"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item
                label="名"
                prop="firstName"
                :label-width="formLabelWidth"
                label-position="top"
                style="flex: 1"
              >
                <el-input
                  v-model="form.firstName"
                  autocomplete="off"
                  placeholder="請輸入個案名"
                  :disabled="isDisabled"
                  style="width: 100%"
                />
              </el-form-item>
            </div>

            <el-form-item
              label="個案類型"
              prop="caseType"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="form.caseType"
                placeholder="請選擇個案類型"
                :disabled="isDisabled"
              >
                <el-option
                  v-for="option in CASE_TYPE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="createCaseProfile()">新增</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogTableVisible" @close="closeApplyDialog" top="5vh">
    <h1 style="padding: 10px 20px 25px 20px">
      下載補助文件（個案姓名：{{ selectedCaseName }}）
    </h1>
    <div
      style="
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 0 20px;
      "
    >
      <div style="flex-grow: 1; padding: 0 20%">
        <!-- <el-steps
          :active="active"
          process-status="success"
          finish-status="success"
        >
          <el-step title="Step 1" description="選擇申請補助" />
          <el-step title="Step 2" description="預覽申請文件" />
          <el-step title="Step 3" description="下載申請文件" />
        </el-steps> -->
        <el-steps
          :active="active"
          process-status="success"
          finish-status="success"
        >
          <el-step title="Step 1" description="選擇申請補助" />
          <el-step title="Step 2" description="下載申請文件" />
        </el-steps>
      </div>
    </div>

    <div class="common-layout">
      <el-container>
        <el-main>
          <!-- Selection counter — shown across both list views. -->
          <div v-if="selectedRows.length > 0" class="selection-counter">
            已選 {{ selectedRows.length }} 項
          </div>

          <!-- Table 1 -->
          <el-table
            v-if="active === 0"
            :data="projectList"
            style="width: 99%"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            empty-text="尚無個案資料"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column width="100px" prop="successRate">
              <template #header>
                <el-tooltip content="☻ 同類型個案申請成功機率" placement="top">
                  <span>成功率 ⓘ</span>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column
              width="120px"
              label="補助編號"
              prop="projectId"
            ></el-table-column>
            <el-table-column
              label="補助名稱"
              prop="projectName"
            ></el-table-column>
            <el-table-column
              width="120px"
              label="補助類型"
              prop="projectType"
            ></el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    width: 100px;
                    overflow: hidden;
                  "
                >
                  <el-button
                    size="small"
                    style="
                      flex: 1;
                      min-width: 0;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    @click="openProjectUrl(scope.row)"
                  >
                    網站連結
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- Table 2 -->
          <!-- <el-table
            v-if="active === 1"
            :data="filteredProjectList"
            style="width: 99%"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              width="120px"
              label="補助編號"
              prop="projectId"
            ></el-table-column>
            <el-table-column
              label="補助名稱"
              prop="projectName"
            ></el-table-column>
            <el-table-column
              width="120px"
              label="補助類型"
              prop="projectType"
            ></el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    width: 100px;
                    overflow: hidden;
                  "
                >
                  <el-button
                    size="small"
                    style="
                      flex: 1;
                      min-width: 0;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    @click="openDetailDialog(scope.row)"
                  >
                    預覽申請文件
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table> -->
          <!-- Table 3 -->
          <el-table
            v-if="active === 1"
            :data="filteredProjectList"
            style="width: 99%"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            empty-text="尚無補助方案資料"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              width="120px"
              label="補助編號"
              prop="projectId"
            ></el-table-column>
            <el-table-column
              label="補助名稱"
              prop="projectName"
            ></el-table-column>
            <el-table-column
              width="120px"
              label="補助類型"
              prop="projectType"
            ></el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    width: 100px;
                    overflow: hidden;
                  "
                >
                  <el-button
                    size="small"
                    style="
                      flex: 1;
                      min-width: 0;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    @click="handleDownload(scope.row)"
                  >
                    下載申請文件
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 25, 50, 100]"
            layout="total, sizes, prev, pager, next"
            :total="totalRecords"
            style="display: flex; justify-content: center; padding-top: 20px"
          ></el-pagination>
        </el-main>
      </el-container>
    </div>

    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button v-if="active > 0 && active != 2" type="primary" @click="prev"
          >上一步</el-button
        >
        <el-button v-if="active != 2" type="primary" @click="next"
          >下一步</el-button
        >
        <el-button v-if="active == 2" @click="closeApplyDialog">完成</el-button>
      </span>
    </template> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="active > 0 && active == 1" type="primary" @click="prev"
          >上一步</el-button
        >
        <el-button v-if="active != 1" type="primary" @click="next"
          >下一步</el-button
        >
        <el-button v-if="active == 1" @click="closeApplyDialog">完成</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="historyFormVisible" @close="closeDialog" top="5vh">
    <h1 style="padding: 10px 20px 25px 20px">
      建立的申請結果（ 個案姓名：{{ selectedCaseName }} ）
    </h1>
    <div class="dialog-content">
      <!-- 申請結果 -->
      <el-form
        ref="historyformRef"
        :model="historyForm"
        :rules="historyRules"
        class="form-section"
        style="width: 100%"
      >
        <div>
          <div>
            <el-form-item
              label="補助名稱"
              prop="sponsorName"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="historyForm.sponsorName"
                placeholder="請選擇補助名稱"
                :disabled="isDisabled"
                filterable
                clearable
              >
                <el-option
                  v-for="option in sponsors"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="申請時間"
              prop="applyTime"
              :label-width="formLabelWidth"
            >
              <el-date-picker
                v-model="historyForm.applyTime"
                type="date"
                placeholder="請選擇申請時間"
                :disabled="isDisabled"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="申請結果"
              prop="result"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="historyForm.result"
                placeholder="請選擇申請結果"
                :disabled="isDisabled"
              >
                <el-option
                  v-for="option in PROJECT_RESULT_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeHistoryDialog">取消</el-button>
        <el-button type="primary" @click="createCaseHistory()">新增</el-button>
      </span>
    </template>
  </el-dialog>

  <div class="common-layout">
    <el-container>
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        :default-active="activeIndex"
        :style="menuStyle"
      >
        <el-menu-item @click="toggleCollapse">
          <!-- Dynamically set the icon based on isCollapse state -->
          <img
            :src="currentIcon"
            alt="toggle-icon"
            style="width: 20px; height: 20px"
          />
        </el-menu-item>
        <!-- Dropdown to filter by caseType -->
        <div v-if="!isCollapse" class="search-container-wrapper">
          <el-select
            v-model="selectedCaseTypes"
            placeholder="篩選個案類型"
            class="filter-dropdown"
            clearable
            multiple
          >
            <el-option
              v-for="option in CASE_TYPE_OPTIONS"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <!-- Search input -->
          <el-input
            v-model="search"
            placeholder="搜尋"
            class="search-input"
          ></el-input>
        </div>

        <el-scrollbar
          class="scroll-container"
          style="flex: 1"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="infiniteScrollDisabled"
          infinite-scroll-distance="50"
        >
          <template v-for="(item, index) in filterTableData" :key="index">
            <el-menu-item :index="item.caseId" @click="() => handleClick(item)">
              <span v-if="!isCollapse">
                {{ item.caseName }}
              </span>
            </el-menu-item>
          </template>
        </el-scrollbar>
      </el-menu>

      <el-main style="margin: 0 20px">
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 35px;
          "
        >
          <el-radio-group v-model="tabPosition">
            <el-radio-button value="top">基本資料</el-radio-button>
            <el-radio-button value="right">個案背景</el-radio-button>
            <el-radio-button value="bottom">申請歷程</el-radio-button>
          </el-radio-group>

          <div style="display: flex; margin-right: 15px">
            <el-button
              v-if="
                selectedCase &&
                !isEditing &&
                tabPosition != 'bottom' &&
                perms.case_managementWrite
              "
              type="primary"
              @click="toggleEdit()"
            >
              編輯</el-button
            >
            <el-button
              v-if="
                selectedCase &&
                !isEditing &&
                tabPosition == 'bottom' &&
                perms.case_managementWrite
              "
              type="primary"
              @click="openHistoryDialog()"
            >
              新增申請紀錄</el-button
            >
            <el-button
              v-if="
                selectedCase &&
                !isEditing &&
                tabPosition == 'bottom' &&
                isSelectHistory &&
                perms.case_managementDelete
              "
              type="danger"
              @click="deleteSelectedRecords()"
            >
              刪除</el-button
            >
            <el-button
              v-if="
                selectedCase &&
                !isEditing &&
                tabPosition != 'bottom' &&
                perms.case_managementDelete
              "
              type="danger"
              @click="deleteSelectedRows()"
            >
              刪除</el-button
            >
            <el-button v-if="isEditing" type="primary" @click="saveEdit()"
              >儲存</el-button
            >

            <el-button v-if="isEditing" type="danger" @click="closeEdit()"
              >取消</el-button
            >
            <el-button
              v-if="selectedCase && !isEditing"
              type="success"
              @click="openApplyDialog"
              >開始申請</el-button
            >
          </div>
        </div>

        <el-divider content-position="left">
          <h2>{{ currentTabLabel }}</h2>
        </el-divider>

        <CaseProfile
          v-if="tabPosition === 'top'"
          :selectedCase="selectedCase"
          :isEditing="isEditing"
          :isSave="isSave"
          :isCancel="isCancel"
          @update:isEditing="handleIsEditingUpdate"
        />
        <CaseBackground
          v-else-if="tabPosition === 'right'"
          :selectedCase="selectedCase"
          :isEditing="isEditing"
          :isSave="isSave"
          :isCancel="isCancel"
          @update:isEditing="handleIsEditingUpdate"
        />
        <CaseHistory v-else-if="tabPosition === 'bottom'" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { apiSwitch } from "../../stores/apiSwitch";
import {
  ASIDE_ICONS,
  CASE_TYPE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  PROJECT_RESULT_OPTIONS,
} from "../../dropdownOptions";
import CaseProfile from "./CaseProfile.vue";
import CaseBackground from "./CaseBackground.vue";
import CaseHistory from "./CaseHistory.vue";
import { useCaseStore } from "../../stores/caseStore";
import { usePermissionStore } from "../../stores/index";
import { storeToRefs } from "pinia";

const caseStore = useCaseStore();
const { isSelectHistory } = storeToRefs(caseStore);

// Permission flag map ({case_managementRead/Write/Delete}, etc.). Used to
// hide action buttons from users whose permission group doesn't allow them.
const permStore = usePermissionStore();
const { permissions: perms } = storeToRefs(permStore);
const tableData = ref([]);
const projectList = ref([]);
const dialogFormVisible = ref(false);
const dialogTableVisible = ref(false);
const historyFormVisible = ref(false);
const sponsors = ref([]);

const selectedCaseTypes = ref([]);
const search = ref("");
const formLabelWidth = "20%";
const formRef = ref(null);
const historyformRef = ref(null);
const isDisabled = ref(false);
const isEditing = ref(false);
const isSave = ref(false);
const isCancel = ref(false);
const isCollapse = ref(false);
const tabPosition = ref("top");
const selectedCase = ref(null);
const selectedCaseName = ref("");
const steps = 2;
const active = ref(0);
const selectedRows = ref([]);

const scrollData = ref([]);
const infiniteScrollDisabled = ref(false);

const filteredProjectList = computed(() => {
  // Filter projectList based on selectedRows
  return projectList.value.filter((project) =>
    selectedRows.value.some(
      (selected) => selected.projectId === project.projectId
    )
  );
});

// Handle row selection in Table 1
const handleSelectionChange = (selection) => {
  if (active.value === 0) {
    selectedRows.value = selection;
  }
};

const next = () => {
  console.log(selectedRows.value);
  if (active.value === 0 && selectedRows.value.length === 0) {
    ElMessage.error("請至少選擇一個補助才能繼續");
    return;
  }
  if (active.value < steps) {
    active.value++;
  }
};

const prev = () => {
  if (active.value > 0) {
    active.value--;
  }
};

const currentTabLabel = computed(() => {
  switch (tabPosition.value) {
    case "top":
      return "基本資料";
    case "right":
      return "個案背景";
    case "bottom":
      return "申請歷程";
    default:
      return "";
  }
});

// Dynamic menu width based on collapse state
const menuStyle = computed(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  minWidth: isCollapse.value ? "auto" : "200px",
}));

const form = ref({
  lastName: "",
  firstName: "",
  caseType: "",
});

const historyForm = ref({
  sponsorName: "",
  applyTime: null,
  result: "",
});

const rules = {
  lastName: [{ required: true, message: "請輸入個案名稱", trigger: "blur" }],
  firstName: [{ required: true, message: "請輸入個案名稱", trigger: "blur" }],
  caseType: [{ required: true, message: "請選擇個案類型", trigger: "change" }],
};

const historyRules = {
  sponsorName: [
    { required: true, message: "請選擇補助名稱", trigger: "change" },
  ],
  applyTime: [{ required: true, message: "請選擇申請日期", trigger: "change" }],
  result: [{ required: true, message: "請選擇申請結果", trigger: "change" }],
};

const toggleEdit = () => {
  isEditing.value = true;
  isSave.value = false;
  isCancel.value = false;
};

const saveEdit = () => {
  isSave.value = true;
  isCancel.value = false;
  isEditing.value = false;
};

const closeEdit = () => {
  isCancel.value = true;
  isSave.value = false;
  isEditing.value = false;
};

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const handleIsEditingUpdate = (newIsEditing) => {
  isEditing.value = newIsEditing;
};

const deleteSelectedRows = () => {
  ElMessageBox.confirm("確定要刪除個案嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        // API
        console.log("delete caseId:", selectedCase.value);
        await apiSwitch("deleteCaseProfile", { caseId: selectedCase.value });

        // 删除成功，更新UI
        selectedCase.value = [];
        console.log(selectedCase.value);
        fetchData();
        ElMessage({
          type: "success",
          message: "成功刪除選中的項目",
        });
      } catch (error) {
        ElMessage.error("刪除失敗");
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};

const deleteSelectedRecords = () => {
  ElMessageBox.confirm("確定要刪除紀錄嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        // API
        const historyIds = isSelectHistory.value.map((item) => item.id);
        await apiSwitch("deleteCaseHistories", { historyIds: historyIds });

        // 删除成功，更新UI
        caseStore.setSelectedHistory(false);
        caseStore.triggerCreateCaseHistory();
        ElMessage({
          type: "success",
          message: "成功刪除選中的項目",
        });
      } catch (error) {
        ElMessage.error("刪除失敗");
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};

// Computed property for the current icon
const currentIcon = ref(null);

const updateIcon = async () => {
  const iconKey = isCollapse.value ? "chevronRight" : "chevronLeft";
  currentIcon.value = (await ASIDE_ICONS[iconKey]()).default;
};

// sabrina: case type mapping
const caseTypeMap = CASE_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

// sabrina: case type mapping
const projectTypeMap = PROJECT_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const fetchData = async () => {
  try {
    // Fetch the data from the API
    const response = await apiSwitch("queryCases");

    // Log the response to verify its structure
    console.log("API Response:", response.data.data);

    // Check if the response and response.data exist
    if (response && response.data) {
      // Map the data to match your table's expected format
      const newData = Array.isArray(response.data.data)
        ? response.data.data.map((item) => {
            return {
              caseId: item.id,
              caseName: item.fullName,
              caseType: item.caseType,
            };
          })
        : [];

      // Refresh the table data regardless of whether newData is empty
      tableData.value = newData; // Always set to newData to refresh

      // Disable infinite scroll if newData is empty
      infiniteScrollDisabled.value = newData.length === 0;

      if (newData.length === 0) {
        console.warn("No data found.");
      }
    } else {
      console.error("Error: response data is not valid.");
      ElMessage.error("Failed to load data.");
      infiniteScrollDisabled.value = true;
    }
  } catch (error) {
    console.error("Error fetching cases data:", error);
    ElMessage.error("Failed to load data.");
    infiniteScrollDisabled.value = true;
  }
};

const fetchSponsors = async () => {
  try {
    const response = await apiSwitch("querySponsorProjects");
    if (response && response.data) {
      // Adjust this based on your API data structure
      sponsors.value = response.data.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch sponsors:", error);
  }
};

const loadMore = () => {
  const nextPage = Math.ceil(tableData.value.length / 20) + 1; // Assuming 20 items per page
  fetchData(nextPage);
};

onMounted(() => {
  fetchData(1);
});

const fetchProjectList = async (page) => {
  try {
    // Fetch the data from the API
    const response = await apiSwitch("querySponsorProjects", { page });

    // Log the response to verify its structure
    console.log("API Response:", response.data.data);

    // Check if the response and response.data exist, and if response.data.data is an array
    if (response && response.data && Array.isArray(response.data.data)) {
      projectList.value = response.data.data.map((item) => {
        return {
          projectId: item.id,
          projectName: item.name,
          projectType: projectTypeMap[item.type] || item.type,
          projectOrg: item.organization,
          projectUrl: item.url,
          projectMemo: item.memo,
          filepath: item.filepath,
          successRate: "123",
        };
      });
    } else {
      console.error("Error: response data is not an array or is null.");
      ElMessage.error("Failed to load data.");
      projectList.value = [];
    }
  } catch (error) {
    console.error("Error fetching cases data:", error);
    ElMessage.error("Failed to load data.");
  }
};

const fetchProjectSuccessList = async (page) => {
  try {
    const req = { caseId: selectedCase.value };
    console.log("IDDDDDD", req);
    // Fetch the data from the API
    const response = await apiSwitch("querySponsorSuccessRate", req);

    // Log the response to verify its structure
    console.log("API Response:", response.data.data);

    // Check if the response and response.data exist, and if response.data.data is an array
    if (response && response.data && Array.isArray(response.data.data)) {
      projectList.value = response.data.data.map((item) => {
        return {
          projectId: item.id,
          projectName: item.name,
          projectType: projectTypeMap[item.type] || item.type,
          projectOrg: item.organization,
          projectUrl: item.url,
          projectMemo: item.memo,
          filepath: item.filepath,
          successRate: item.successRate,
        };
      });
    } else {
      console.error("Error: response data is not an array or is null.");
      ElMessage.error("Failed to load data.");
      projectList.value = [];
    }
  } catch (error) {
    console.error("Error fetching cases data:", error);
    ElMessage.error("Failed to load data.");
  }
};

onMounted(async () => {
  // Preload icons used for collapse state
  await Promise.all([ASIDE_ICONS.chevronRight(), ASIDE_ICONS.chevronLeft()]);

  // Update the currentIcon based on the initial state of isCollapse
  await updateIcon();
});

// Method to handle item click
const handleClick = (item) => {
  selectedCase.value = item.caseId;
  selectedCaseName.value = item.caseName;

  // Update Pinia store
  caseStore.setSelectedCase({
    caseId: item.caseId,
    caseName: item.caseName,
    caseType: item.caseType,
  });
};

const handleDownload = async () => {
  try {
    const req = {
      caseId: selectedCase.value,
      sponsorId: filteredProjectList.value[0].projectId,
    };

    fetch("http://localhost:8081/api/case/downloadCaseApplications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob(); // Convert the response to a Blob
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
        const a = document.createElement("a"); // Create a link element
        a.href = url;
        a.download = `${filteredProjectList.value[0].projectName}.docx`; // Set the filename for the download
        document.body.appendChild(a); // Append link to the body
        a.click(); // Programmatically click the link to trigger the download
        a.remove(); // Remove the link from the document
        window.URL.revokeObjectURL(url); // Clean up the URL object
      })
      .catch((error) => {
        console.error("Error during file download:", error);
      });
  } catch (error) {
    console.error("Operation failed:", error);
    ElMessage.error("Download failed");
  }
};

const openDialog = () => {
  dialogFormVisible.value = true;
  isEditing.value = false;
  form.value = {
    lastName: "",
    firstName: "",
    caseType: "",
  };
};

const closeDialog = () => {
  dialogFormVisible.value = false;
};

const openApplyDialog = () => {
  // fetchProjectList(1);
  fetchProjectSuccessList(1);
  dialogTableVisible.value = true;
  isEditing.value = false;
  selectedRows.value = [];
};

const closeApplyDialog = () => {
  dialogTableVisible.value = false;
  active.value = 0;
};

const openHistoryDialog = () => {
  fetchSponsors();
  historyFormVisible.value = true;
  isEditing.value = false;
  selectedRows.value = [];
  historyForm.value = {
    sponsorName: "",
    applyTime: null,
    result: "",
  };
};

const closeHistoryDialog = () => {
  historyFormVisible.value = false;
};

const openProjectUrl = (row) => {
  if (row.projectUrl) {
    window.open(row.projectUrl, "_blank");
  } else {
    ElMessage.error("No valid URL available for this project.");
  }
};

const createCaseProfile = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const formContent = form.value;
      try {
        const req = {
          lastName: formContent.lastName,
          firstName: formContent.firstName,
          fullName: `${formContent.lastName}${formContent.firstName}`,
          caseType: formContent.caseType,
        };

        console.log("API Request:", req);
        const response = await apiSwitch("createCaseProfile", req);
        if (response.data.code === "S01010") {
          closeDialog();
          ElMessage.success("新增成功");
          fetchData();
        } else {
          ElMessage.error("新增失敗1");
        }
      } catch (error) {
        ElMessage.error("新增失敗2");
      }
    } else {
      ElMessage.error("請填寫所有必填補助");
    }
  });
};

const createCaseHistory = async () => {
  // Validate the history form
  historyformRef.value.validate(async (valid) => {
    if (valid) {
      const formContent = historyForm.value;
      try {
        const req = {
          caseId: selectedCase.value,
          sponsorId: formContent.sponsorName,
          applyTime: formContent.applyTime,
          result: formContent.result,
        };

        console.log("API Request:", req);
        const response = await apiSwitch("createCaseHistory", req);

        if (response.data.code === "S01010") {
          closeHistoryDialog(); // Close the dialog after success
          ElMessage.success("新增成功");
          fetchData(); // Refresh data if needed
          caseStore.triggerCreateCaseHistory();
          console.log("triggered");
        } else {
          ElMessage.error("新增失敗1");
        }
      } catch (error) {
        ElMessage.error("新增失敗4");
      }
    } else {
      ElMessage.error("請填寫所有必填欄位");
    }
  });
};

// 篩選個案清單
const filterTableData = computed(() => {
  return tableData.value.filter((data) => {
    const matchesSearch =
      !search.value ||
      (data.caseName &&
        data.caseName.toLowerCase().includes(search.value.toLowerCase()));

    const matchesCaseType =
      selectedCaseTypes.value.length === 0 ||
      selectedCaseTypes.value.includes(data.caseType);

    return matchesSearch && matchesCaseType;
  });
});
//分頁
const currentPage = ref(1); // 當前頁碼
const pageSize = ref(20);
const totalRecords = computed(() => tableData.value.length);

// 計算當前頁的數據
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filterTableData.value.slice(start, end);
});

// 處理分頁大小變化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

// 處理當前頁面變化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

//即時計算搜尋過後的頁碼
const filteredDataLength = computed(() => {
  return filterTableData.value.length;
});

watch(filteredDataLength, (newLength) => {
  if (newLength < pageSize.value * (currentPage.value - 1)) {
    currentPage.value = 1;
  }
});

// Watch for changes in isCollapse to update the icon
watch(
  isCollapse,
  async () => {
    await updateIcon();
  },
  { immediate: true }
);

watch(
  isSelectHistory,
  (newVal) => {
    if (newVal) {
      // appear button
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.selection-counter {
  display: inline-block;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 4px;
  background: #ecf5ff;
  color: #409eff;
  font-size: 13px;
}
.search-container-wrapper {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.search-input {
  width: 100%;
}

.scroll-container {
  height: calc(100vh - 64px); /* Adjust based on your layout */
  overflow-y: auto;
}

.el-menu-vertical-demo {
  /* background-color: #424242; */
  width: 65px;
  min-height: 400px;
}

.el-menu-item {
  color: #373535;
  border-radius: 6px;
  margin: 2px 5px;
}
:deep(.el-form-item__label) {
  align-items: center; /* Vertically center-align content */
  justify-content: flex-start; /* Left-align content */
  padding: 0 8px 0 0; /* Adjust padding */
}
.dialog-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0px 50px;
}

.form-section {
  width: 48%;
}

.dynamic-input {
  display: flex;
  align-items: center;
}

.dynamic-input .el-input {
  margin-right: 10px;
}

:deep(.el-input) {
  margin-bottom: 5px;
}
</style>

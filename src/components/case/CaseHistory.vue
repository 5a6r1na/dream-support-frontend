<!--CaseHistory.vue -->
<template>
  <!-- Table -->
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-table
          :data="paginatedData"
          style="width: 99%"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="申請編號" prop="historyId"></el-table-column>
          <el-table-column label="申請時間" prop="applyTime"></el-table-column>
          <el-table-column
            label="補助名稱"
            prop="sponsorName"
          ></el-table-column>
          <el-table-column
            label="補助類型"
            prop="sponsorType"
          ></el-table-column>
          <el-table-column label="申請結果" prop="result"></el-table-column>

          <!-- <<el-table-column>
            <template #default="scope">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  gap: 5px;
                  width: 100%;
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
                  申請資料
                </el-button>
              </div>
            </template>
          </el-table-column> -->
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="totalRecords"
          style="display: flex; justify-content: center; padding-top: 20px"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { apiSwitch } from "../../stores/apiSwitch";
import {
  PROJECT_RESULT_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "../../dropdownOptions";
import { useCaseStore } from "../../stores/caseStore";
import { storeToRefs } from "pinia";

const caseStore = useCaseStore();
const { selectedCase, isCreatingHistory, triggerFetch } =
  storeToRefs(caseStore);

const tableData = ref([]);
const dialogFormVisible = ref(false);
const isEditing = ref(false);
const selectedRows = ref([]);
const search = ref("");
const formLabelWidth = "20%";
const ruleFormRef = ref(null);
const isDisabled = ref(false);

const form = ref({
  result: "",
});

const props = defineProps({
  selectedCase: Object,
  isEditing: Boolean,
  isSave: Boolean,
  isCancel: Boolean,
});

// sabrina: result type mapping
const projectResultMap = PROJECT_RESULT_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

// sabrina: result type mapping
const sponsorTypeMap = PROJECT_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const fetchData = async () => {
  try {
    const reqBody = {
      caseId: selectedCase.value.caseId,
    };

    // Fetch the data from the API
    const response = await apiSwitch("getCaseHistory", reqBody);

    // Log the response to verify its structure
    console.log("API Response:", response.data.data);

    // Check if the response and response.data exist, and if response.data.data is an array
    if (response && response.data && Array.isArray(response.data.data)) {
      tableData.value = response.data.data.map((item) => ({
        historyId: item.id,
        sponsorName: item.sponsorName,
        sponsorType: sponsorTypeMap[item.sponsorType] || item.sponsorType,
        applyTime: item.applyTime,
        result: projectResultMap[item.result] || item.result,
      }));
    } else {
      console.error("Error: response data is not an array or is null.");
      tableData.value = [];
    }
  } catch (error) {
    console.error("Error fetching cases data:", error);
  }
};

onMounted(() => {
  fetchData();
});

// Dynamic menu width based on collapse state

const handleSelectionChange = (val) => {
  selectedRows.value = val;
  const req = selectedRows.value.map((row) => ({
    id: row.historyId,
  }));
  console.log("delete row selected", req.length);

  if (req.length != 0) {
    caseStore.setSelectedHistory(req);
  } else {
    caseStore.setSelectedHistory(false);
  }
};

const deleteSelectedRows = () => {
  ElMessageBox.confirm("確定要刪除選中的補助嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const historyIds = selectedRows.value.map((row) => row.historyId);

        await apiSwitch("deleteCaseHistories", { historyIds });

        tableData.value = tableData.value.filter(
          (item) => !selectedRows.value.includes(item)
        );
        selectedRows.value = [];
        ElMessage.success("刪除成功");
      } catch (error) {
        console.error("Error deleting case history:", error);
        ElMessage.error("刪除失敗");
      }
    })
    .catch(() => {
      ElMessage.info("取消刪除");
    });
};

//查詢
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      // 可以查詢的欄位
      (data.caseId &&
        data.caseId.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.caseName &&
        data.caseName.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.caseType &&
        data.caseType.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.sponsorName &&
        data.sponsorName.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.time &&
        data.time.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.result &&
        data.result.toLowerCase().includes(search.value.toLowerCase()))
  )
);

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

const handleScroll = (event) => {
  const scrollbar = event.target;
  const bottom =
    scrollbar.scrollHeight === scrollbar.scrollTop + scrollbar.clientHeight;
  if (bottom && !loading) {
    loadMore();
  }
};

const loadMore = () => {
  if (loading) return;
  loading = true;
  // Simulate loading more data
  setTimeout(() => {
    currentPage.value++;
    loading = false;
  }, 1000); // Adjust the delay as needed
};

let loading = false;

watch(filteredDataLength, (newLength) => {
  if (newLength < pageSize.value * (currentPage.value - 1)) {
    currentPage.value = 1;
  }
});

// 監聽 store 狀態變化
watch(
  selectedCase,
  (newVal) => {
    if (newVal) {
      fetchData();
    }
  },
  { immediate: true }
);

watch(
  isCreatingHistory,
  (newVal) => {
    if (newVal) {
      fetchData();
    }
  },
  { immediate: true }
);

// watch(
//   isSelectHistory,
//   (newVal) => {
//     if (!newVal) {
//       selectedRows.value = [];
//     }
//   },
//   { immediate: true }
// );

// 監聽個案類型變更並清空相關欄位
const handlecaseTypeChange = (newType) => {
  form.value.pageUrl = "";
  form.value.targetUrl = "";
  form.value.method = "";
  form.value.params = [{ paramKey: "", paramValue: "" }];
  form.value.header = [{ headerKey: "", headerValue: "" }];
  form.value.dataType = "";
  form.value.htmlUrl = "";
  form.value.queryScript = "";
};

//轉詳細顯示格式
const formatParams = (paramArray) => {
  return paramArray
    .map((param) => `${param.paramKey}:${param.paramValue}`)
    .join(" , ");
};

const formatHeader = (headerArray) => {
  return headerArray
    .map((header) => `${header.headerKey}:${header.headerValue}`)
    .join(" , ");
};
</script>

<style scoped>
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

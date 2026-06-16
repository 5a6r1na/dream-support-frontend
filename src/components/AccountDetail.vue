<!-- accountDetail.vue -->
<template>
  <div style="display: flex; justify-content: space-between">
    <el-button v-if="perms.account_managementWrite" @click="openDialog">
      新增帳號
    </el-button>
    <div style="display: flex; margin-right: 15px">
      <el-input
        v-model="search"
        size="small"
        placeholder="搜尋"
        style="margin-right: 8px"
      ></el-input>
      <el-button
        v-if="perms.account_managementWrite"
        type="primary"
        @click="handleSingleEdit()"
        :disabled="selectedRows.length !== 1"
        >編輯</el-button
      >
      <el-button
        v-if="perms.account_managementDelete"
        type="danger"
        @click="deleteSelectedRows()"
        :disabled="selectedRows.length === 0"
        >刪除</el-button
      >
    </div>
  </div>
  <el-dialog
    v-model="dialogFormVisible"
    :title="isEditing ? '編輯帳號' : '新增帳號'"
    @close="handleDialogClose"
    @keyup.enter.native="isEditing ? updateAccount() : addAccount()"
  >
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="username">
        <el-input
          v-model="form.username"
          autocomplete="off"
          @input="handleUsernameInput"
        />
      </el-form-item>
      <el-form-item
        label="帳號"
        :label-width="formLabelWidth"
        prop="userLoginId"
      >
        <el-input
          v-model="form.userLoginId"
          autocomplete="off"
          :onInput="handleInput"
          placeholder="僅能輸入英數"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="密碼" :label-width="formLabelWidth" prop="password">
        <el-input
          ref="passwordInput"
          v-model="form.password"
          autocomplete="off"
          type="password"
          @click="handlePasswordFocus"
          minlength="8"
          maxlength="20"
          placeholder="僅能輸入英數8-20碼"
          @input="handlePasswordInput"
        />
      </el-form-item>
      <el-form-item
        label="權限群組"
        :label-width="formLabelWidth"
        prop="roleId"
      >
        <el-select v-model="form.roleId" placeholder="請選擇權限群組">
          <el-option
            v-for="group in permissionGroups"
            :key="group.roleId"
            :label="group.roleName"
            :value="group.roleId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="isEditing ? updateAccount() : addAccount()"
          :disabled="isEditing ? !hasChanges : false"
        >
          {{ isEditing ? "更新" : "新增" }}
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Selection counter — shown above the table when at least one row is picked. -->
  <div v-if="selectedRows.length > 0" class="selection-counter">
    已選 {{ selectedRows.length }} 項
  </div>

  <!-- Table -->
  <el-table
    :data="paginatedData"
    style="width: 99%; margin-top: 10px"
    @selection-change="handleSelectionChange"
    ref="multipleTable"
    empty-text="尚無帳號資料"
  >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="姓名" prop="username" min-width="120" />
    <el-table-column label="帳號" prop="userLoginId" min-width="120" />
    <el-table-column label="權限群組" prop="roleName" min-width="120" />
    <el-table-column label="角色" min-width="100">
      <template #default="scope">
        <el-tag
          :type="scope.row.role === 'ADMIN' ? 'danger' : ''"
          size="small"
          effect="plain"
        >
          {{ scope.row.role === "ADMIN" ? "管理員" : "一般使用者" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="狀態" min-width="120">
      <template #default="scope">
        <el-switch
          v-if="perms.account_managementWrite"
          :model-value="scope.row.status === 'ACTIVE'"
          active-text="啟用"
          inactive-text="停用"
          inline-prompt
          @change="(v) => handleToggleStatus(scope.row, v)"
        />
        <el-tag v-else :type="statusTagType(scope.row.status)" size="small">
          {{ statusLabel(scope.row.status) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="最後登入" min-width="160">
      <template #default="scope">
        {{ formatDateTime(scope.row.lastLoginAt) }}
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
    :total="filteredDataLength"
    style="display: flex; justify-content: center; padding-top: 20px"
  >
  </el-pagination>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { apiSwitch } from "../stores/apiSwitch";
import { useAccountStore, usePermissionStore } from "../stores/index";
import { storeToRefs } from "pinia";
import {
  groupLabel,
  formatDateTime,
  statusLabel,
  statusTagType,
} from "../lib/permissionLabels";
const permissionStore = useAccountStore();
const { permissions: perms } = storeToRefs(usePermissionStore());
const tableData = ref([]);
const permissionGroups = ref([]);

watch(
  () => permissionStore.needAccountRefresh,
  (newVal) => {
    if (newVal) {
      fetchData(); // 重新加載帳號數據
      permissionStore.setNeedAccountRefresh(false); // 重置刷新標記
    }
  }
);

const fetchData = async () => {
  try {
    const requestData = { userLoginId: null, userId: null };
    const response = await apiSwitch("queryAccounts", requestData);
    if (response && response.data.data && Array.isArray(response.data.data)) {
      tableData.value = response.data.data.map((item) => ({
        userId: item.userId,
        userLoginId: item.userLoginId,
        password: item.password,
        username: item.username,
        email: item.email,
        roleId: item.roleId,
        // Show 管理員 / 一般使用者 / 唯讀 in the table rather than the raw
        // English group name that the backend persists.
        roleName: groupLabel(item.roleName),
        role: item.role,
        status: item.status,
        lastLoginAt: item.lastLoginAt,
      }));
      // console.log(tableData.value);
    }
  } catch (error) {
    console.error("Error fetching userId details:", error);
  }
};
const fetchPermissionGroups = async () => {
  try {
    const requestData = { roleId: null };
    const response = await apiSwitch("queryPermissionGroups", requestData);
    if (response && response.data.data && Array.isArray(response.data.data)) {
      permissionGroups.value = response.data.data.map((group) => ({
        // Localised label for the form dropdown.
        roleName: groupLabel(group.roleName),
        roleId: group.roleId,
      }));
    }
  } catch (error) {
    console.error("Error fetching permission groups details:", error);
  }
};

onMounted(() => {
  fetchData();
  fetchPermissionGroups();
});

//多選框
const selectedRows = ref([]);
const handleSelectionChange = (val) => {
  selectedRows.value = val;
};
//查詢
const search = ref("");
const filterTableData = computed(() => {
  if (!search.value) return tableData.value;
  const needle = search.value.toLowerCase();
  return tableData.value.filter((data) => {
    const fields = [
      data.username,
      data.userLoginId,
      data.roleName,
      data.email,
    ];
    return fields.some((f) => (f || "").toLowerCase().includes(needle));
  });
});

const openDialog = () => {
  fetchPermissionGroups();
  resetForm();
  dialogFormVisible.value = true;
  isEditing.value = false;
};

const ruleFormRef = ref(null);
//新增帳號
const addAccount = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const requestData = {
        userLoginId: form.userLoginId,
        username: form.username,
        password: form.password,
        roleId: form.roleId,
      };
      try {
        // 調用創建帳號的 API
        await apiSwitch("createAccount", requestData);
        ElMessage.success("帳號新增成功");

        fetchData(); // 刷新表格數據
        resetForm(); // 重置表單
        dialogFormVisible.value = false; // 關閉對話框
      } catch (error) {
        ElMessage.error("帳號新增失敗");
      }
    } else {
      ElMessage.error("請填寫所有必填項目");
    }
  });
};

const originalData = ref({});

//編輯
const isEditing = ref(false); // 新增狀態標記
const editingIndex = ref(-1); // 編輯時的索引
const handleSingleEdit = () => {
  if (selectedRows.value.length === 1) {
    fetchPermissionGroups();
    const row = selectedRows.value[0];
    form.userId = row.userId;
    form.userLoginId = row.userLoginId;
    form.username = row.username;
    form.password = row.password;
    form.roleId = row.roleId;
    isEditing.value = true;
    dialogFormVisible.value = true;

    originalData.value = {
      userLoginId: row.userLoginId,
      username: row.username,
      password: row.password,
      roleId: row.roleId,
    };
  }
};

const hasChanges = computed(() => {
  const fieldsFilled =
    form.userLoginId.trim() !== "" &&
    form.username.trim() !== "" &&
    form.password.trim() !== "" &&
    form.roleId !== "";
  return (
    fieldsFilled &&
    (originalData.value.userLoginId !== form.userLoginId ||
      originalData.value.username !== form.username ||
      originalData.value.password !== form.password ||
      originalData.value.roleId !== form.roleId)
  );
});

const updateAccount = async () => {
  if (isEditing.value && selectedRows.value.length === 1) {
    ruleFormRef.value.validate(async (valid) => {
      if (valid) {
        const oldData = selectedRows.value[0];
        const requestData = {
          userId: form.userId,
          oldUserLoginId: oldData.userLoginId,
          newUserLoginId:
            form.userLoginId !== oldData.userLoginId ? form.userLoginId : null,
          username: form.username !== oldData.username ? form.username : null,
          password: form.password !== oldData.password ? form.password : null,
          roleId: form.roleId !== oldData.roleId ? form.roleId : null,
        };

        try {
          const response = await apiSwitch("updateAccount", requestData);
          if (response && response.data) {
            const index = tableData.value.findIndex(
              (row) => row.userId === oldData.userId
            );
            if (index !== -1) {
              tableData.value[index] = {
                ...tableData.value[index],
                userId: response.data.userId,
                username: response.data.username,
                password: response.data.password,
                roleId: response.data.roleId,
              };
              fetchData(); // 刷新表格數據
              ElMessage.success("帳號編輯成功");
              resetForm();
            }
          }
        } catch (error) {
          console.log("捕捉到錯誤:", error);
          ElMessage.error("帳號編輯失敗");
        }
      } else {
        ElMessage.error("請填寫所有必填項目");
      }
    });
  }
};

//刪除
const deleteSelectedRows = async () => {
  ElMessageBox.confirm("確定要刪除選中的項目嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const selectedIDs = selectedRows.value.map((row) => ({
        userId: row.userId,
        userLoginId: row.userLoginId,
      }));

      try {
        await apiSwitch("deleteAccount", selectedIDs);
        selectedRows.value = [];
        fetchData();
        ElMessage.success("成功刪除選中的項目");
      } catch (error) {
        ElMessage.error("刪除帳號失敗");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

//更新&新增的表單
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const form = reactive({
  userLoginId: "",
  username: "",
  password: "",
  roleId: "",
});
//重置表單
const resetForm = () => {
  Object.assign(form, {
    userLoginId: "",
    username: "",
    password: "",
    roleId: "",
  });
  dialogFormVisible.value = false;
  isEditing.value = false;
  editingIndex.value = -1;
};

// 取消按鈕後清除表單內容
const closeDialog = () => {
  dialogFormVisible.value = false;
  resetForm();
  // formRef.value.resetFields();
};

const validatePassword = (rule, value, callback) => {
  if (value.length < 8 || value.length > 20) {
    callback(new Error("密碼長度需介於8-20碼"));
  } else {
    callback();
  }
};
const validateNoWhitespace = (rule, value, callback) => {
  if (/\s/.test(value)) {
    callback(new Error("輸入不能包含空格"));
  } else {
    callback();
  }
};
//必填規則
const rules = reactive({
  username: [
    { required: true, message: "請輸入姓名", trigger: "blur" },
    { validator: validateNoWhitespace, trigger: "blur" },
  ],
  userLoginId: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
  password: [
    { required: true, message: "請輸入密碼", trigger: "blur" },
    { validator: validatePassword, trigger: "blur" },
    { validator: validateNoWhitespace, trigger: "blur" },
  ],
  roleId: [{ required: true, message: "請選擇權限群組", trigger: "blur" }],
});

// 編輯內的密碼欄位
const passwordInput = ref(null);
const handlePasswordFocus = () => {
  if (isEditing.value) {
    ElMessageBox.confirm("修改密碼會覆蓋先前密碼，是否繼續？", "警告", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        form.password = "";
      })
      .catch(() => {
        passwordInput.value.blur();
      });
  }
};

//分頁
const pageSize = ref(10);
const currentPage = ref(1);

// 啟用 / 停用 帳號
const handleToggleStatus = async (row, willBeActive) => {
  const targetStatus = willBeActive ? "ACTIVE" : "DISABLED";
  try {
    await apiSwitch("toggleAccountStatus", {
      userId: row.userId,
      status: targetStatus,
    });
    ElMessage.success(targetStatus === "ACTIVE" ? "帳號已啟用" : "帳號已停用");
    fetchData();
  } catch (error) {
    ElMessage.error("狀態更新失敗");
  }
};

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
const handleInput = (value) => {
  // 使用正則表達式檢查輸入的值是否符合條件
  const regex = /^[a-zA-Z0-9]*$/; // 只允許英文字母和數字
  if (!regex.test(value)) {
    // 如果不符合條件，則移除非法字符
    form.userLoginId = value.replace(/[^a-zA-Z0-9]/g, "");
  }
};
// 限制欄位輸入
// 限制 username 欄位輸入，移除所有類型的空白字符
const handleUsernameInput = () => {
  form.username = form.username.replace(/\s/g, ""); // 使用 \s 匹配並移除任何空白字符
};

// 限制 password 欄位輸入，允許英數且移除所有空白
const handlePasswordInput = () => {
  form.password = form.password.replace(/[^a-zA-Z0-9]/g, ""); // 移除非英數字符
};

const handleDialogClose = () => {
  resetForm(); // 重置表單

  ruleFormRef.value.resetFields();
};
</script>

<style scoped>
.responsive-table {
  width: 100%;
}
.selection-counter {
  display: inline-block;
  margin-top: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  background: #ecf5ff;
  color: #409eff;
  font-size: 13px;
}
</style>

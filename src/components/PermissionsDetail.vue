<!-- permissionsDetail.vue -->
<template>
  <div style="display: flex; justify-content: space-between">
    <el-button v-if="perms.account_managementWrite" @click="openAddDialog">
      新增權限群組
    </el-button>
    <div style="display: flex; margin-right: 15px">
      <el-input
        v-model="search"
        size="small"
        placeholder="搜尋"
        style="margin-right: 12px"
      ></el-input>
      <el-button
        v-if="perms.account_managementWrite"
        type="primary"
        @click="editSelectedRow()"
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
    :title="isEditing ? '編輯權限群組' : '新增權限群組'"
    @close="handleDialogClose"
    @keyup.enter.native="isEditing ? updateGroup() : addGroup()"
  >
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-form-item
        label="群組名稱"
        :label-width="formLabelWidth"
        prop="roleName"
      >
        <el-input
          v-model="form.roleName"
          autocomplete="off"
          @input="handleChargerIdInput"
        />
      </el-form-item>
      <el-form-item
        label="權限"
        :label-width="formLabelWidth"
        prop="permission"
      >
        <el-select
          v-model="selectedPermission"
          multiple
          clearable
          filterable
          default-first-option
          placeholder="請選擇群組權限"
          style="width: 100%"
        >
          <template #header>
            <el-checkbox
              v-model="checkAll"
              :indeterminate="indeterminate"
              @change="handleCheckAll"
            >
              All
            </el-checkbox>
          </template>
          <el-option
            v-for="item in cascaderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="isEditing ? updateGroup() : addGroup()"
        >
          {{ isEditing ? "更新" : "新增" }}
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="changeRoleDialogVisible" title="更改權限群組">
    <el-table :data="accountsToChangeRole" style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="userLoginId" label="帳號"></el-table-column>
      <el-table-column label="權限群組">
        <template #default="scope">
          <el-select
            v-model="scope.row.roleId"
            placeholder="請選擇群組權限"
            style="width: 100%"
          >
            <el-option
              v-for="item in availablePermissionGroups"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button @click="changeRoleDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        :disabled="!allRolesSelected"
        @click="applyRoleChanges"
        >更新帳號並刪除群組</el-button
      >
    </template>
  </el-dialog>

  <!-- Selection counter -->
  <div v-if="selectedRows.length > 0" class="selection-counter">
    已選 {{ selectedRows.length }} 項
  </div>

  <!-- Table -->
  <el-table
    :data="paginatedData"
    style="width: 99%; margin-top: 10px"
    @selection-change="handleSelectionChange"
    ref="multipleTable"
    empty-text="尚無權限群組資料"
  >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="群組名稱" prop="roleName" width="160" />
    <el-table-column label="權限">
      <template #default="scope">
        <div class="perm-tags">
          <el-tag
            v-for="token in scope.row.permissionTokens"
            :key="token"
            :type="permissionTagType(token)"
            size="small"
            effect="light"
            class="perm-tag"
          >
            {{ permissionLabel(token) }}
          </el-tag>
          <span v-if="!scope.row.permissionTokens || scope.row.permissionTokens.length === 0" class="perm-empty">
            尚未指派
          </span>
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
    :total="filteredDataLength"
    style="display: flex; justify-content: center; padding-top: 20px"
  >
  </el-pagination>
</template>

<script setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { apiSwitch } from "../stores/apiSwitch";
import { useAccountStore, usePermissionStore } from "../stores/index";
import { storeToRefs } from "pinia";
import { permissionLabel, groupLabel, permissionTagType } from "../lib/permissionLabels";

const permissionStore = useAccountStore();
const { permissions: perms } = storeToRefs(usePermissionStore());
//多選框
const selectedRows = ref([]);
const handleSelectionChange = (val) => {
  selectedRows.value = val;
  selectedToDeleteRoleIds.value = selectedRows.value.map((row) => row.roleId);
};

// const selectedPermission = ref([]);
const selectedPermission = computed({
  get() {
    return form.permission;
  },
  set(value) {
    form.permission = value;
  },
});

const cascaderOptions = ref([]);
const permissionGroups = ref([]);
const selectedToDeleteRoleIds = ref([]);
//列表API
const fetchPermissionGroups = async () => {
  try {
    const requestData = { roleId: null };
    const response = await apiSwitch("queryPermissionGroups", requestData);
    if (response && response.data.data && Array.isArray(response.data.data)) {
      tableData.value = response.data.data.map((item) => ({
        roleId: item.roleId,
        // Display the localised group name (管理員 / 一般使用者 / …) but keep
        // the raw English name elsewhere so edits round-trip cleanly.
        roleName: groupLabel(item.roleName),
        rawRoleName: item.roleName,
        permission: item.permission
          ? item.permission.map(permissionLabel).join("、")
          : "",
        permissionTokens: item.permission || [],
      }));
      permissionGroups.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching permission groups details:", error);
  }
};

//所有權限查詢
const fetchPermission = async () => {
  try {
    const response = await apiSwitch("getPermissionList");
    if (
      response &&
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.permission)
    ) {
      const permissions = response.data.data.permission;
      cascaderOptions.value = permissions.map((token) => ({
        value: token,
        label: permissionLabel(token),
      }));
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error fetching permissions:", error);
    // ElMessage({
    //   type: "error",
    //   message: "無法獲取權限",
    // });
  }
};

onMounted(() => {
  fetchPermissionGroups();
  fetchPermission();
});

// const getPermissionLabels = (selectedPermission) => {
//   return cascaderOptions.value
//     .filter((option) => selectedPermission.includes(option.value))
//     .map((option) => option.label)
//     .join(", ");
// };

const tableData = ref([]);

//查詢
const search = ref("");
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      //可以查詢的欄位
      data.roleName.toLowerCase().includes(search.value.toLowerCase()) ||
      data.permission.toLowerCase().includes(search.value.toLowerCase())
  )
);

// 新增群組對話框
const openAddDialog = () => {
  resetForm();
  dialogFormVisible.value = true;
  isEditing.value = false;
};

//新增
const addGroup = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const requestData = {
        roleName: form.roleName,
        permission: form.permission,
      };
      try {
        await apiSwitch("createPermissionGroup", requestData);

        ElMessage({
          type: "success",
          message: "新增權限群組成功",
        });

        fetchPermissionGroups();
        resetForm();
      } catch (error) {
        ElMessage.error("新增失敗");
      }
    } else {
      ElMessage.error("請填寫所有必填項目");
    }
  });
};

const editSelectedRow = () => {
  if (selectedRows.value.length === 1) {
    const row = selectedRows.value[0];
    const index = tableData.value.findIndex(
      (item) => item.roleId === row.roleId
    );
    isEditing.value = true;
    editingIndex.value = index;
    // Edit the raw English group name; display labels live only in the table.
    form.roleName = row.rawRoleName || row.roleName;
    // permissionTokens preserves the backend's raw English tokens so we can
    // round-trip them through update without label-to-token guesswork.
    form.permission = Array.isArray(row.permissionTokens)
      ? [...row.permissionTokens]
      : [];
    dialogFormVisible.value = true;
  }
};

const isEditing = ref(false); // 新增狀態標記
const editingIndex = ref(-1); // 編輯時的索引

// 轉換格式
const findPermissionValues = (label, options) => {
  for (const option of options) {
    if (option.label === label) {
      return [option.value];
    }
    if (option.children) {
      const childPath = findPermissionValues(label, option.children);
      if (childPath.length) {
        return [option.value].concat(childPath);
      }
    }
  }
  return [];
};

//更新群組
const updateGroup = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const roleId = tableData.value[editingIndex.value].roleId;

      try {
        const requestData = {
          roleId: roleId,
          roleName: form.roleName,
          permission: form.permission,
        };
        const response = await apiSwitch("updatePermissionGroup", requestData);
        if (response && response.data) {
          ElMessage({
            type: "success",
            message: "更新權限群組成功",
          });

          fetchPermissionGroups();
          resetForm();
          permissionStore.setNeedAccountRefresh(true);
        }
      } catch (error) {
        console.error("Error updating permission group:", error);
        ElMessage({
          type: "error",
          message: "更新失敗",
        });
      }
    } else {
      ElMessage.error("請填寫所有必填項目");
    }
  });
};

const allRolesSelected = computed(() => {
  return accountsToChangeRole.value.every((account) => account.roleId);
});

//刪除
const deleteSelectedRows = async () => {
  await ElMessageBox.confirm("確定要刪除選中的項目嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const selectedToDeleteRoleIds = selectedRows.value.map(
        (row) => row.roleId
      );
      // 檢核帳號的roleId
      try {
        const checkAccountsRequestData = { roleIds: selectedToDeleteRoleIds };
        const accountResponse = await apiSwitch(
          "queryAccounts",
          checkAccountsRequestData
        );

        // 檢查帳號是否有使用到要刪除的roleId
        const isRoleUsed = accountResponse.data.data.some((account) =>
          selectedToDeleteRoleIds.includes(account.roleId)
        );

        if (isRoleUsed) {
          showChangeRoleDialog(accountResponse.data.data);
        } else {
          await proceedWithDeletion(selectedToDeleteRoleIds);
        }
      } catch (error) {
        console.error("Error during delete operation:", error);
        ElMessage({
          type: "error",
          message: "删除操作失败",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除操作已取消",
      });
    });
};

// 顯示被刪除以外的群組當作項
const availablePermissionGroups = computed(() => {
  // console.log(permissionGroups.value);
  return permissionGroups.value.filter(
    (group) => !selectedToDeleteRoleIds.value.includes(group.roleId)
  );
});

//刪除群組
const proceedWithDeletion = async (roleIds) => {
  try {
    // Backend expects `roleIds` (plural) when deleting multiple groups.
    const requestData = { roleIds };
    const response = await apiSwitch("deletePermissionGroup", requestData);
    if (response && response.data) {
      ElMessage({
        type: "success",
        message: "權限群組删除成功",
      });
      selectedRows.value = [];
      fetchPermissionGroups();
      resetForm();
    }
  } catch (error) {
    // console.error("Error deleting permission group:", error);
    ElMessage({
      type: "error",
      message: "删除失敗",
    });
  }
};

// 更改權限群組的Dialog
const changeRoleDialogVisible = ref(false);
const accountsToChangeRole = ref({});
const showChangeRoleDialog = (accounts) => {
  accountsToChangeRole.value = accounts
    .filter((account) => selectedToDeleteRoleIds.value.includes(account.roleId))
    .map((account) => ({
      ...account,
      roleId: "",
    }));

  if (accountsToChangeRole.value.length > 0) {
    changeRoleDialogVisible.value = true;
  } else {
    proceedWithDeletion(selectedToDeleteRoleIds.value);
  }
};

//  更改權限群組
const applyRoleChanges = async () => {
  const updates = accountsToChangeRole.value.map((account) => ({
    userId: account.userId,
    roleId: account.roleId,
  }));

  try {
    const response = await apiSwitch("updateAccounts", updates);
    if (response && response.data) {
      ElMessage({
        type: "success",
        message: "帳號權限更新成功",
      });
      changeRoleDialogVisible.value = false;
      await proceedWithDeletion(selectedToDeleteRoleIds.value);
      permissionStore.setNeedAccountRefresh(true);
    }
  } catch (error) {
    console.error("Failed to update account roles:", error);
    ElMessage({
      type: "error",
      message: "更新失败",
    });
  }
};

//更新&新增的表單
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const form = reactive({
  roleName: "",
  permission: [],
});

//重置表單
const resetForm = () => {
  Object.assign(form, {
    roleName: "",
    permission: "",
  });
  selectedPermission.value = []; // 清空聯集選擇器的選擇
  dialogFormVisible.value = false;
  isEditing.value = false;
  editingIndex.value = -1;
};

// 取消按鈕後清除表單內容
const formRef = ref(null);
const closeDialog = () => {
  dialogFormVisible.value = false;
  resetForm();
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

//判斷all勾選
const indeterminate = ref(false);
const checkAll = ref(false);
watch(
  selectedPermission,
  (newVal) => {
    const optionsCount = cascaderOptions.value.length;
    if (newVal.length === optionsCount) {
      checkAll.value = true;
      indeterminate.value = false;
    } else {
      indeterminate.value = false;
      checkAll.value = false;
    }
  },
  { deep: true }
);

const handleCheckAll = (val) => {
  if (val) {
    selectedPermission.value = cascaderOptions.value.map(
      (option) => option.value
    );
  } else {
    selectedPermission.value = [];
  }
  indeterminate.value = false;
};

//分頁
const pageSize = ref(10);
const currentPage = ref(1);

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

//必填規則
const rules = ref({
  roleName: [{ required: true, message: "請輸入群組名稱", trigger: "blur" }],
  permission: [{ required: true, message: "請選擇權限", trigger: "blur" }],
});

// 限制欄位輸入
const handleChargerIdInput = () => {
  form.roleName = form.roleName.replace(/\s/g, ""); // 使用 \s 匹配任何空白字符
};

const handleDialogClose = () => {
  resetForm(); // 重置表單
  formRef.value.resetFields();
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
.perm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.perm-tag {
  margin: 0;
}
.perm-empty {
  color: #909399;
  font-size: 12px;
}
</style>

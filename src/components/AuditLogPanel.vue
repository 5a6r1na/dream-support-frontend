<!-- AuditLogPanel.vue -->
<!--
  Read-only viewer for the audit_log table. Lists recent admin actions with
  actor, action, target, and timestamp. The backend caps the response at 100
  rows so the table is bounded.
-->
<template>
  <div>
    <div class="audit-toolbar">
      <el-button size="small" @click="fetchData" :loading="loading">
        重新整理
      </el-button>
      <span class="audit-hint">最近 {{ tableData.length }} 筆紀錄</span>
    </div>

    <el-table
      :data="tableData"
      style="width: 99%; margin-top: 10px"
      v-loading="loading"
      empty-text="尚無稽核紀錄"
    >
      <el-table-column label="時間" min-width="160">
        <template #default="scope">
          {{ formatDateTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作人員" prop="actorUsername" min-width="120" />
      <el-table-column label="動作" min-width="140">
        <template #default="scope">
          <el-tag :type="actionTagType(scope.row.action)" size="small" effect="plain">
            {{ auditActionLabel(scope.row.action) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="對象" min-width="160">
        <template #default="scope">
          <span class="target-type">{{ targetTypeLabel(scope.row.targetType) }}</span>
          <span class="target-label">{{ scope.row.targetLabel || "—" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="詳細" min-width="220">
        <template #default="scope">
          <code class="payload">{{ scope.row.payload || "—" }}</code>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { apiSwitch } from "../stores/apiSwitch";
import { formatDateTime, auditActionLabel } from "../lib/permissionLabels";

const tableData = ref([]);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const resp = await apiSwitch("queryAuditLog", { limit: 100 });
    if (resp?.data?.data && Array.isArray(resp.data.data)) {
      tableData.value = resp.data.data;
    }
  } catch (err) {
    ElMessage.error("查詢稽核紀錄失敗");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

// Visual mapping from action token to el-tag type.
const actionTagType = (action) => {
  if (!action) return "";
  if (action.includes("CREATE")) return "success";
  if (action.includes("UPDATE")) return "warning";
  if (action.includes("DELETE")) return "danger";
  if (action.includes("TOGGLE")) return "info";
  return "";
};

const targetTypeLabel = (t) => {
  if (t === "USER") return "帳號";
  if (t === "PERMISSION_GROUP") return "權限群組";
  return t || "—";
};

defineExpose({ refresh: fetchData });
</script>

<style scoped>
.audit-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
}
.audit-hint {
  color: #909399;
  font-size: 12px;
}
.target-type {
  display: inline-block;
  min-width: 64px;
  color: #606266;
  margin-right: 8px;
}
.target-label {
  color: #303133;
  font-weight: 500;
}
.payload {
  display: inline-block;
  max-width: 100%;
  font-size: 12px;
  color: #606266;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  word-break: break-all;
}
</style>

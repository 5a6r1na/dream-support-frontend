<!-- WebCrawler.vue -->
<template>
  <el-container
    style="
      min-height: 100vh;
      min-width: 100vw;
      height: 100vh;
      overflow-x: hidden;
    "
  >
    <template v-if="isMobile">
      <!-- <el-header style="padding: 0"><MobileNavbar></MobileNavbar></el-header> -->
    </template>
    <template v-else>
      <Aside @toggleAside="handleToggle" style="min-height: 100%"></Aside>
    </template>
    <el-container>
      <el-main style="background: #eaeaea">
        <div style="padding: 20px; width: 100%">
          <h3 style="padding-bottom: 10px; font-weight: bold; color: black">
            帳號管理
          </h3>
          <el-card>
            <AccountDetail></AccountDetail>
          </el-card>
        </div>
        <div style="padding: 20px; width: 100%">
          <h3 style="padding-bottom: 10px; font-weight: bold; color: black">
            權限管理
          </h3>
          <el-card>
            <permissionsDetail></permissionsDetail>
          </el-card>
        </div>
        <div style="padding: 20px; width: 100%">
          <h3 style="padding-bottom: 10px; font-weight: bold; color: black">
            稽核紀錄
          </h3>
          <el-card>
            <AuditLogPanel></AuditLogPanel>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Aside from "../layout/Aside.vue";
import AccountDetail from "../components/AccountDetail.vue";
import permissionsDetail from "../components/PermissionsDetail.vue";
import AuditLogPanel from "../components/AuditLogPanel.vue";
const isMobile = ref(window.innerWidth <= 768);

// 監聽螢幕尺寸變化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

function handleToggle(value = null) {
  asideOpen.value = value !== null ? value : !asideOpen.value;
}

const asideOpen = ref(true);
</script>

<style scoped>
body {
  background-color: #ffffff;
  max-width: 100vw;
  overflow: hidden;
}

.el-main {
  width: 100%;
  padding: 0;
  overflow-x: hidden;
}
</style>

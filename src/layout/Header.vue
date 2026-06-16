<!-- Header.vue -->
<template>
  <div>
    <el-header
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        padding-left: 20px;
        background-color: white;
        color: black;
      "
    >
      <div style="display: flex; align-items: center">
        <img src="../assets/logo.png" alt="Logo" style="width:40px"/>
        <span
          @click="goToHome"
          style="cursor: pointer; font-weight: bold; margin-left: 8px"
        >
          Dream Support 個案支援系統
        </span>
      </div>
      <!-- <el-button @click="logout" style="margin-right: 10px;">登出</el-button> -->
      <!-- <el-button
        @click="logout"
        style="margin-right: 10px"
        v-if="shouldShowLogout"
        >登出</el-button
      > -->
    </el-header>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const goToHome = () => {
  router.push('/')
}
// const goToHome = () => {
//   router.push("/Dashboard");
// };

const shouldShowLogout = computed(() => route.path !== "/");
const logout = () => {
  router.push("/");
};
</script>

<style scoped></style>

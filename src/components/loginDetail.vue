<!-- loginDetail.vue -->
<template>
  <div>
    <img src="/logo.png" style="margin: 20px auto; display: block; width: 60px" />
    <h2 style="text-align: center; margin: 0 0 16px 0; color: #303133">
      Dream Support 個案支援系統
    </h2>

    <el-form
      ref="formRef"
      :model="loginModel"
      :rules="rules"
      label-position="top"
      @keyup.enter="handleLogin"
    >
      <el-form-item label="帳號" prop="username">
        <el-input
          v-model="loginModel.username"
          placeholder="請輸入帳號"
          maxlength="64"
          autocomplete="username"
        />
      </el-form-item>

      <el-form-item label="密碼" prop="password">
        <el-input
          v-model="loginModel.password"
          type="password"
          placeholder="請輸入密碼"
          show-password
          maxlength="128"
          autocomplete="current-password"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          style="margin: 20px auto 0; width: 100px"
          type="primary"
          :loading="isLoggingIn"
          @click.prevent="handleLogin"
        >
          登入
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import actions from "../services/apis";

const router = useRouter();
const route = useRoute();

const formRef = ref(null);
const isLoggingIn = ref(false);
const loginModel = ref({
  username: "",
  password: "",
});

const rules = {
  username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
  password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
};

const handleLogin = async () => {
  if (isLoggingIn.value) return;

  // Validate before hitting the network.
  try {
    await formRef.value.validate();
  } catch {
    return;
  }

  isLoggingIn.value = true;
  try {
    await actions.loginAction(loginModel.value);
    ElMessage.success("登入成功");

    // If the user was redirected here from a protected page, send them back.
    const redirect = route.query.redirect;
    router.push(typeof redirect === "string" && redirect ? redirect : "/CaseManagement");
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message;
    if (status === 401) {
      ElMessage.error(msg || "帳號或密碼錯誤");
    } else if (status === 403) {
      ElMessage.error(msg || "帳號已停用");
    } else {
      ElMessage.error(msg || "登入失敗,請稍後再試");
    }
  } finally {
    isLoggingIn.value = false;
  }
};
</script>

<style scoped></style>

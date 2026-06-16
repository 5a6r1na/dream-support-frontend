<!-- src/components/Login.vue -->
<template>
  <el-container
    style="min-height: 100vh; min-width: 100vw; height: 100vh; width: 100%"
  >
    <!-- <el-header><Header></Header></el-header> -->
    <el-container>
      <el-container>
        <el-main
          style="background: #424242; display: flex; align-items: center"
        >
          <div style="padding: 20px; width: 100%">
            <el-card
              style="width: 500px; margin: auto; background-color: #eaeaea"
            >
              <loginDetail></loginDetail>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import loginDetail from "../components/LoginDetail.vue";
import { ElForm } from "element-plus";

const form = ref({
  username: "",
  password: "",
});

const formRef = ref(null);
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    await formRef.value.validate();
    const success = await authStore.login(
      form.value.username,
      form.value.password
    );
    if (success) {
      alert("Login successful!");
      // Redirect or perform additional actions here
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Validation failed:", error);
  }
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>

<style scoped>
body {
  background-color: #eaeaea;
  max-width: 100vw;
  overflow: hidden;
}
.el-main {
  width: 100%;
  padding: 0;
  overflow-x: hidden;
}
</style>

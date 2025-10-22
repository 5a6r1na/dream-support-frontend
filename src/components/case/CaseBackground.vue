<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    class="form-section"
    style="width: 100%"
  >
    <el-form-item
      label="家庭收入"
      prop="familyIncome"
      :label-width="formLabelWidth"
      label-position="top"
    >
      <el-select
        v-model="form.familyIncome"
        :disabled="isDisabled"
        placeholder="請選擇個案類型"
      >
        <el-option
          v-for="option in FAMILY_INCOME_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="收入來源"
      prop="incomeSource"
      :label-width="formLabelWidth"
      label-position="top"
    >
      <el-select
        v-model="form.incomeSource"
        :disabled="isDisabled"
        placeholder="請選擇個案類型"
      >
        <el-option
          v-for="option in INCOME_SOURCE_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="同住者（關係人）"
      prop="cohabitants"
      :label-width="formLabelWidth"
      label-position="top"
    >
      <el-select
        v-model="form.cohabitants"
        :disabled="isDisabled"
        placeholder="請選擇個案類型"
      >
        <el-option
          v-for="option in COHABITANT_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="身心狀況（疾病＆情緒）"
      prop="healthStatus"
      :label-width="formLabelWidth"
      label-position="top"
      style="flex: 1"
    >
      <el-input
        v-model="form.healthStatus"
        autocomplete="off"
        placeholder="請簡述個案身心狀況"
        :disabled="isDisabled"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item
      label="個案困境"
      prop="situationDescription"
      :label-width="formLabelWidth"
      label-position="top"
      style="flex: 1"
    >
      <el-input
        v-model="form.situationDescription"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        autocomplete="off"
        placeholder="請簡述個案困境（情境）"
        :disabled="isDisabled"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item
      label="個案需求"
      prop="needs"
      :label-width="formLabelWidth"
      label-position="top"
      style="flex: 1"
    >
      <el-input
        v-model="form.needs"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        autocomplete="off"
        placeholder="請簡述個案需求"
        :disabled="isDisabled"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item
      label="個案處遇"
      prop="treatment"
      :label-width="formLabelWidth"
      label-position="top"
      style="flex: 1"
    >
      <el-input
        v-model="form.treatment"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        autocomplete="off"
        placeholder="請簡述個案處遇"
        :disabled="isDisabled"
        style="width: 100%"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";
import { apiSwitch } from "../../stores/apiSwitch";
import {
  COHABITANT_OPTIONS,
  FAMILY_INCOME_OPTIONS,
  INCOME_SOURCE_OPTIONS,
} from "../../dropdownOptions";

const formLabelWidth = "20%";
const formRef = ref(null);
const isDisabled = ref(true);
const isEditing = ref(false);
const isSave = ref(false);
const isCancel = ref(false);
const selectedCase = ref("");

const emit = defineEmits(["update:isEditing"]);

const props = defineProps({
  selectedCase: Object,
  isEditing: Boolean,
  isSave: Boolean,
  isCancel: Boolean,
});

// Initialize the local form state with an empty object
const form = ref({
  familyIncome: "",
});

const rules = {
  // familyIncome: [
  //   { required: true, message: "請選擇個案類型", trigger: "change" },
  // ],
};

const saveData = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const formContent = form.value;
      try {
        const reqBody = {
          caseId: selectedCase.value,
          familyIncome: formContent.familyIncome,
          incomeSource: formContent.incomeSource,
          cohabitants: formContent.cohabitants,
          healthStatus: formContent.healthStatus,
          situationDescription: formContent.situationDescription,
          needs: formContent.needs,
          treatment: formContent.treatment,
        };

        console.log("API Request:", reqBody);
        // Fetch the data from the API
        const response = await apiSwitch("updateCaseBackground", reqBody);

        // Log the response to verify its structure
        console.log("API Response:", response.data);
        isEditing.value = false;
      } catch (error) {
        console.error("Error fetching cases data:", error);
        isEditing.value = true;
        emit("update:isEditing", true);
      }
    }
  });
};

const fetchData = async (item) => {
  try {
    const reqBody = {
      caseId: item,
    };
    // Fetch the data from the API
    const response = await apiSwitch("getCaseBackground", reqBody);

    // Log the response to verify its structure
    console.log("API Response:", response.data.data);

    // Populate the form in CaseProfile.vue with the response data
    form.value = response.data.data;
  } catch (error) {
    console.error("Error fetching cases data:", error);
  }
};

watch(
  () => props.selectedCase,
  (newVal) => {
    if (newVal) {
      selectedCase.value = newVal;
      fetchData(selectedCase.value);
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => [props.isEditing, props.isSave, props.isCancel],
  ([newEditing, newSave, newCancel]) => {
    isEditing.value = newEditing;
    isDisabled.value = !newEditing;
    isSave.value = newSave;
    isCancel.value = newCancel;

    console.log("isEditing:", isEditing.value);
    console.log("isDisabled:", isDisabled.value);
    console.log("isSave:", isSave.value);
    console.log("isCancel:", isCancel.value);

    if (newSave) {
      if (formRef.value) {
        saveData();
      }
    }
  },
  { immediate: true, deep: true }
);
</script>

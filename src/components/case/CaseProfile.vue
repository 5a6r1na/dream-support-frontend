<!--CaseProfile.vue -->
<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    class="form-section"
    style="width: 100%"
  >
    <div>
      <div>
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
          <el-form-item
            label="生理性別"
            prop="gender"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-select
              v-model="form.gender"
              placeholder="請選擇個案類型"
              :disabled="isDisabled"
              @change="handlecaseTypeChange"
            >
              <el-option label="男" value="M" />
              <el-option label="女" value="F" />
            </el-select>
          </el-form-item>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            gap: 30px;
            width: 100%;
          "
        >
          <el-form-item
            label="出生西元年"
            prop="birthYear"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-input
              v-model="form.birthYear"
              autocomplete="off"
              placeholder="請輸入出生西元年"
              :disabled="isDisabled"
              @blur="updateBirthYearROC"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="出生民國年"
            prop="birthYearROC"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-input
              v-model="form.birthYearROC"
              autocomplete="off"
              :disabled="true"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="出生月"
            prop="birthMonth"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-input
              v-model="form.birthMonth"
              autocomplete="off"
              placeholder="請輸入出生月"
              :disabled="isDisabled"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="出生日"
            prop="birthDay"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-input
              v-model="form.birthDay"
              autocomplete="off"
              placeholder="請輸入出生日"
              :disabled="isDisabled"
              style="width: 100%"
            />
          </el-form-item>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            gap: 30px;
            width: 100%;
          "
        >
          <el-form-item
            label="行動電話"
            prop="mobileNum"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-input
              v-model="form.mobileNum"
              autocomplete="off"
              placeholder="請輸入行動電話"
              :disabled="isDisabled"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="住家電話"
            prop="landlineNum"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-input
              v-model="form.landlineNum"
              autocomplete="off"
              placeholder="請輸入住家電話"
              :disabled="isDisabled"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="公司電話"
            prop="officeNum"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-input
              v-model="form.officeNum"
              autocomplete="off"
              placeholder="請輸入公司電話"
              :disabled="isDisabled"
              style="width: 100%"
            />
          </el-form-item>
        </div>
        <el-form-item
          label="現居地"
          prop="residence"
          :label-width="formLabelWidth"
          label-position="top"
          style="flex: 1"
        >
          <el-input
            v-model="form.residence"
            autocomplete="off"
            placeholder="請輸入個案現居地"
            :disabled="isDisabled"
            style="width: 100%"
          />
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { ref, watch, computed, defineEmits } from "vue";
import { apiSwitch } from "../../stores/apiSwitch";
import { CASE_TYPE_OPTIONS } from "../../dropdownOptions";

const formLabelWidth = "20%";
const formRef = ref(null);
const isDisabled = ref(true);
const isEditing = ref(false);
const isSave = ref(false);
const isCancel = ref(false);
const selectedCase = ref("");
const isActive = ref("");

const emit = defineEmits(["update:isEditing"]);

const props = defineProps({
  selectedCase: Object,
  active: Object,
  isEditing: Boolean,
  isSave: Boolean,
  isCancel: Boolean,
});

// Initialize the local form state with an empty object
const form = ref({
  lastName: "",
  firstName: "",
  gender: "",
  birthYear: "",
  birthYearROC: "",
  birthMonth: "",
  birthDay: "",
  mobileNum: "",
  landlineNum: "",
  officeNum: "",
  residence: "",
  caseType: "",
});

const saveData = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log("valid success");
      const formContent = form.value;
      try {
        const reqBody = {
          caseId: selectedCase.value,
          lastName: formContent.lastName,
          firstName: formContent.firstName,
          fullName: `${formContent.lastName}${formContent.firstName}`,
          gender: formContent.gender,
          birthYear: formContent.birthYear,
          birthYearROC: formContent.birthYearROC,
          birthMonth: formContent.birthMonth,
          birthDay: formContent.birthDay,
          mobileNum: formContent.mobileNum,
          landlineNum: formContent.landlineNum,
          officeNum: formContent.officeNum,
          residence: formContent.residence,
          caseType: formContent.caseType,
        };

        console.log("API Request:", reqBody);

        // Fetch the data from the API
        const response = await apiSwitch("updateCaseProfile", reqBody);

        // Log the response to verify structure
        console.log("API Response:", response.data.data);
        isEditing.value = false;
        emit("update:isEditing", false);

        console.log(isEditing.value);
      } catch (error) {
        console.error("Error fetching cases data:", error);
        isEditing.value = true;
        emit("update:isEditing", true);
      }
    }
  });
};

const fetchData = async () => {
  try {
    if (selectedCase.value) {
      const reqBody = {
        caseId: selectedCase.value,
      };
      // Fetch the data from the API
      const response = await apiSwitch("getCaseProfile", reqBody);

      // Log the response to verify its structure
      console.log("API Response:", response.data.data);

      // Populate the form in CaseProfile.vue with the response data
      form.value = response.data.data;
    }
    // form.value = { ...response.data.data };
  } catch (error) {
    form.value = [];
    console.error("Error fetching cases data:", error);
  }
};

const rules = computed(() => {
  if (isSave.value) {
    console.log("rule true");
    return {
      lastName: [
        { required: true, message: "請輸入個案名稱", trigger: "blur" },
      ],
      firstName: [
        { required: true, message: "請輸入個案名稱", trigger: "blur" },
      ],
      gender: [
        { required: false, message: "請選擇個案類型", trigger: "change" },
      ],
      birthYear: [
        { required: false, message: "請輸入個案出生西元年", trigger: "blur" },
      ],
      birthMonth: [
        { required: false, message: "請輸入個案出生西元年", trigger: "blur" },
      ],
      birthDay: [
        { required: false, message: "請輸入個案出生西元年", trigger: "blur" },
      ],
      mobileNum: [
        { required: false, message: "請輸入個案手機號碼", trigger: "blur" },
      ],
      landlineNum: [
        { required: false, message: "請輸入個案住家電話", trigger: "blur" },
      ],
      officeNum: [
        { required: false, message: "請輸入個案公司電話", trigger: "blur" },
      ],
      caseType: [
        { required: true, message: "請選擇個案類型", trigger: "change" },
      ],
    };
  } else {
    if (formRef.value && isCancel.value) {
      console.log("rule false");
    }
    return {}; // No rules when not editing
  }
});

// sabrina:
// Update BirthYearROC based on updateBirthYear
const updateBirthYearROC = () => {
  const year = parseInt(form.value.birthYear, 10);
  const birthYearROC = year - 1911;
  form.value.birthYearROC = birthYearROC < 0 ? "" : birthYearROC.toString();
};

watch(
  () => props.selectedCase,
  (newVal) => {
    if (newVal) {
      console.log("Selected case:", newVal);
      selectedCase.value = newVal;
      fetchData(selectedCase.value);
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.isCancel,
  (newVal) => {
    if (newVal) {
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

    // console.log("==================================");
    // console.log("isEditing:", isEditing.value);
    // console.log("isDisabled:", isDisabled.value);
    // console.log("isSave:", isSave.value);
    // console.log("isCancel:", isCancel.value);

    if (newSave) {
      if (formRef.value) {
        saveData();
      }
    }
  },
  { immediate: true, deep: true }
);
</script>

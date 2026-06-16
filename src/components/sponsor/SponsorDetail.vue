<!-- sponsorDetail.vue -->
<template>
  <div
    style="
      background: #f9fafc;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 20px;
    "
  >
    <h2 style="margin-bottom: 10px; color: #303133; font-weight: bold">
      如何建立補助檔案
    </h2>

    <p style="color: #606266; line-height: 1.7">
      在上傳補助申請表（.docx）之前，請先在 Word
      檔中設定可自動填入的欄位標籤。<br />
      系統會根據文件中的標籤內容，自動填入個案資料。
    </p>

    <!-- <p style="color: #606266; line-height: 1.7">
      例如：
      <br />
      - 在文件中輸入 &#123;&#123;fullName&#125;&#125;
      系統會自動填入「個案姓名」。
      <br />
      - 在文件中輸入 &#123;&#123;birthYear&#125;&#125;
      系統會自動填入「出生年份」。
    </p> -->

    <!-- <el-alert
      title="提示"
      type="info"
      show-icon
      :closable="false"
      style="margin: 10px 0 20px 0"
      description="上傳的文件需為 .docx 格式，且標籤名稱必須與系統資料欄位一致。"
    /> -->

    <!-- Example preview -->
    <el-card
      shadow="never"
      style="
        margin-bottom: 20px;
        margin-top: 20px;
        background-color: #fffef9;
        border-left: 3px solid #e6a23c;
      "
    >
      <template #header>
        <span style="font-weight: 600; color: #303133">範例：</span>
      </template>
      <p style="margin: 0; color: #606266; line-height: 1.5; font-size: 14px">
        您的補助申請資料如下：
        <br />
        出生日期：&#123;&#123;birthYear&#125;&#125; 年
        &#123;&#123;birthMonth&#125;&#125; 月 &#123;&#123;birthDay&#125;&#125;
        日
        <br />
        連絡電話：&#123;&#123;mobileNum&#125;&#125;
        <br />
        居住地址：&#123;&#123;residence&#125;&#125;
      </p>
    </el-card>

    <!-- Collapsible full tag list -->
    <el-collapse>
      <el-collapse-item>
        <template #title>
          <span style="font-size: 14px"
            >🔎 查看可使用的自動填寫標籤 (Tag List)</span
          >
        </template>
        <ul
          style="
            list-style-type: none;
            padding-left: 10px;
            line-height: 1.8;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px 20px;
          "
        >
          <li>&#123;&#123;lastName&#125;&#125; — 姓氏</li>
          <li>&#123;&#123;firstName&#125;&#125; — 名字</li>
          <li>&#123;&#123;fullName&#125;&#125; — 全名</li>
          <li>&#123;&#123;gender&#125;&#125; — 性別</li>
          <li>&#123;&#123;birthYear&#125;&#125; — 出生年份</li>
          <li>&#123;&#123;birthYearROC&#125;&#125; — 出生年份（民國）</li>
          <li>&#123;&#123;birthMonth&#125;&#125; — 出生月份</li>
          <li>&#123;&#123;birthDay&#125;&#125; — 出生日</li>
          <li>&#123;&#123;mobileNum&#125;&#125; — 行動電話</li>
          <li>&#123;&#123;landlineNum&#125;&#125; — 市內電話</li>
          <li>&#123;&#123;officeNum&#125;&#125; — 辦公電話</li>
          <li>&#123;&#123;residence&#125;&#125; — 居住地址</li>
          <li>&#123;&#123;caseType&#125;&#125; — 個案類型</li>
          <li>&#123;&#123;familyIncome&#125;&#125; — 家庭收入</li>
          <li>&#123;&#123;incomeSource&#125;&#125; — 收入來源</li>
          <li>&#123;&#123;cohabitants&#125;&#125; — 同住者／關係人</li>
          <li>&#123;&#123;healthStatus&#125;&#125; — 身心狀況</li>
          <li>&#123;&#123;situationDescription&#125;&#125; — 個案困境描述</li>
          <li>&#123;&#123;needs&#125;&#125; — 個案需求</li>
          <li>&#123;&#123;treatment&#125;&#125; — 個案處遇</li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>

  <!-- toolbar -->
  <div style="display: flex; justify-content: space-between">
    <el-button
      v-if="perms.sponsor_managementWrite"
      type="primary"
      @click="openCreateForm"
    >
      建立新補助
    </el-button>
    <div style="display: flex; margin-right: 15px">
      <el-input
        v-model="search"
        size="small"
        placeholder="搜尋"
        style="margin-right: 8px"
      ></el-input>
      <el-button
        v-if="perms.sponsor_managementWrite"
        type="primary"
        @click="openEditForm()"
        :disabled="selectedRows.length !== 1"
        >編輯</el-button
      >
      <el-button
        v-if="perms.sponsor_managementDelete"
        type="danger"
        @click="deleteSelectedRows()"
        :disabled="selectedRows.length === 0"
        >刪除</el-button
      >
    </div>
  </div>
  <!-- sponsorForm -->
  <el-dialog
    v-model="sponsorForm"
    :title="isEditing ? '編輯補助資訊' : '新增補助資訊'"
    @close="closeForm"
    top="10vh"
  >
    <div class="dialog-content">
      <el-form
        ref="ruleRef"
        :model="form"
        :rules="rules"
        class="form-section"
        style="width: 100%"
      >
        <div>
          <div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                gap: 30px;
                width: 100%;
              "
            >
              <el-form-item
                label="補助名稱"
                prop="projectName"
                :label-width="formLabelWidth"
                label-position="top"
                style="flex: 1"
              >
                <el-input
                  v-model="form.projectName"
                  autocomplete="off"
                  placeholder="請輸入補助名稱"
                  :disabled="isDisabled"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item
                label="補助單位"
                prop="projectOrg"
                :label-width="formLabelWidth"
                label-position="top"
                style="flex: 1"
              >
                <el-input
                  v-model="form.projectOrg"
                  autocomplete="off"
                  placeholder="請輸入補助單位"
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
                label="補助類型"
                prop="projectType"
                label-position="top"
                :label-width="formLabelWidth"
                style="flex: 1"
              >
                <el-select
                  v-model="form.projectType"
                  placeholder="請選擇補助類型"
                  :disabled="isDisabled"
                >
                  <el-option
                    v-for="option in PROJECT_TYPE_OPTIONS"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="補助網頁"
                prop="projectUrl"
                :label-width="formLabelWidth"
                label-position="top"
                style="flex: 1"
              >
                <el-input
                  v-model="form.projectUrl"
                  autocomplete="off"
                  placeholder="請輸入補助網頁"
                  :disabled="isDisabled"
                  style="width: 100%"
                />
              </el-form-item>
            </div>
          </div>
          <el-form-item
            label="備註"
            prop="projectMemo"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-input
              v-model="form.projectMemo"
              autocomplete="off"
              placeholder="可輸入建立日期或版本等資訊"
              :disabled="isDisabled"
              style="width: 100%"
            />
          </el-form-item>
          <el-alert
            title="提示"
            type="info"
            show-icon
            :closable="false"
            style="margin: 10px 0 20px 0"
            description="上傳的文件需為 .docx 格式，且標籤名稱必須與系統資料欄位一致。"
          />
          <el-form-item
            label="補助申請表"
            prop="file"
            :label-width="formLabelWidth"
            label-position="top"
            style="flex: 1"
          >
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              :limit="1"
              :auto-upload="false"
              :http-request="submitUpload"
              v-model="fileList"
              accept=".docx"
              @change="handleFileChange"
            >
              <template #trigger>
                <el-button type="primary">上傳檔案</el-button>
              </template>

              <template #tip>
                <div v-if="!isEditing" class="el-upload__tip">
                  已選擇的檔案：
                </div>
              </template>
              <!-- Add a custom file list to display the uploaded file -->
              <div v-if="isEditing" class="uploaded-file">
                <span style="color: red; font-size: smaller"
                  >(上傳新檔案將覆蓋原本的申請表)
                </span>
                <br />
                <span>當前申請表: </span>
                <!-- Trigger the download when clicking -->
                <a href="javascript:void(0)" @click="handleFileDownload"
                  >下載檔案</a
                >
              </div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeForm">取消</el-button>
        <el-button
          type="primary"
          @click="submitUpload()"
          :disabled="isEditing ? false : false"
        >
          {{ isEditing ? "更新" : "新增" }}
        </el-button>
      </span>
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
    empty-text="尚無補助方案資料"
  >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="補助編號" prop="projectId" />
    <el-table-column label="補助名稱" prop="projectName" />
    <el-table-column label="補助類型" prop="projectType" />
    <el-table-column label="補助單位" prop="projectOrg" />
    <!-- <el-table-column label="補助網頁" prop="projectUrl" /> -->
    <el-table-column label="備註" prop="projectMemo" />
    <!-- <el-table-column>
      <template #default="scope">
        <div style="display: flex; width: 80px; overflow: hidden">
          <el-button
            size="small"
            style="
              flex: 1;
              min-width: 0;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            @click="handleFileDownload(scope.row)"
          >
            下載申請表
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
    :page-sizes="[10, 25, 50, 100]"
    layout="total, sizes, prev, pager, next"
    :total="filteredDataLength"
    style="display: flex; justify-content: center; padding-top: 20px"
  >
  </el-pagination>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { apiSwitch } from "../../stores/apiSwitch";
import { useAccountStore, usePermissionStore } from "../../stores/index";
import { storeToRefs } from "pinia";
import { PROJECT_TYPE_OPTIONS } from "../../dropdownOptions";

// Permission flag map ({sponsor_managementRead/Write/Delete}, etc.).
const { permissions: perms } = storeToRefs(usePermissionStore());

/**
 * [VARIABLES]: Define sponsor detail variables
 *
 * - permissionStore: Stores the account permissions and other account-related data.
 * - tableData: Holds the data to be displayed in the table.
 * - ruleRef: Reference for the form element.
 * - multipleTable: Reference for the table element.
 * - isEditing: Tracks the form state: Edit mode or Create mode.
 * - editingIndex: Tracks the index of the item being edited; -1 means no item is currently being edited.
 * - fileList: Holds the list of files selected for upload.
 * - uploadRef: Reference for the file upload component.
 * - sponsorForm: Controls the visibility of the Create Sponsor form dialog.
 * - formLabelWidth: Specifies the width of the form labels.
 * - form: Reactive object to hold the sponsor form data.
 * - uploadedFileUrl: Holds the URL of the uploaded file.
 */
const permissionStore = useAccountStore();
const tableData = ref([]);
const ruleRef = ref(null);
const multipleTable = ref(null);
const isEditing = ref(false);
const editingIndex = ref(-1);
const fileList = ref([]);
const uploadRef = ref(null);
const sponsorForm = ref(false);
const formLabelWidth = "20%";
const form = reactive({
  projectId: "",
  projectName: "",
  projectType: "",
  projectOrg: "",
  projectUrl: "",
  projectMemo: "",
});
const uploadedFileUrl = ref("");

/**
 * [FUNCTION]: createSponsorProjects() creates a new sponsor project.
 *
 * @api /api/sponsor/createSponsorProject
 * @param options
 */
const createSponsorProject = (options) => {
  // [STEP]: Validate the input form.
  ruleRef.value.validate((valid) => {
    // [CASE]: If valid, create file, onSuccess, onError in options.
    if (valid) {
      const { file, onSuccess, onError } = options;
      // [CASE]: If NOT valid, log error and return.
      if (!form) {
        console.error("Form data is missing");
        return;
      }

      // [STEP]: Create formData object and append value from input.
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", form.projectName);
      formData.append("organization", form.projectOrg);
      formData.append("type", form.projectType);
      formData.append("url", form.projectUrl);
      formData.append("memo", form.projectMemo || "123");

      // DEBUG: create sponsor project
      console.log(formData.get("file"));
      console.log(formData.get("name"));
      console.log(formData.get("organization"));
      console.log(formData.get("type"));
      console.log(formData.get("url"));
      console.log(formData.get("memo"));

      // [STEP]: Call backend api
      fetch("http://localhost:8081/api/sponsor/createSponsorProject", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          // [CASE]: Success response
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Upload failed");
          }
        })
        .then((data) => {
          // [STEP]: ?
          onSuccess(data);
          // [STEP]: Fetch data again to populate table with new created sponsor project
          fetchData();
          // [STEP]: Reset form
          resetForm();
          // [STEP]: Close sponsor form
          sponsorForm.value = false;
        })
        .catch((err) => {
          // [CASE] Error response
          onError(err);
        });
    }
  });
};

/**
 * [FUNCTION]: submitUpload() handles form submission
 */
const submitUpload = () => {
  console.log("submit clicked");

  ruleRef.value.validate((valid) => {
    if (valid) {
      if (uploadRef.value) {
        // Check if there is at least one file in the file list
        console.log("File List: ", fileList.value); // Use fileList.value to access the array

        // Ensure fileList has at least one file
        const fileProxy = fileList.value[0]; // Access the first file (proxy object)

        if (!fileProxy && !uploadedFileUrl.value) {
          console.error("No file selected.");
          return;
        }

        // Get the actual File object from the 'raw' property of the proxy object
        const file = fileProxy ? fileProxy.raw : null;

        // Log the file directly to ensure it's the correct object
        console.log("File to upload: ", file);

        // Prepare the options object with file and success/error handlers
        const options = {
          file: file, // Pass the actual file object
          onSuccess: (data) => {
            console.log("File uploaded successfully:", data);
            fetchData();
            resetForm();
            sponsorForm.value = false;
          },
          onError: (err) => {
            console.error("File upload failed:", err);
          },
        };

        // Handle logic based on editing state and whether a new file is provided
        if (isEditing.value) {
          // If there's no new file, update the sponsor project without updating the file
          if (!file) {
            updateSponsorProject(); // Only update sponsor details (no file)
          } else {
            updateSponsorProject(); // Update sponsor details
            updateSponsorProjectFile(options); // Update the file as well
          }
        } else {
          // If it's a new sponsor, create the sponsor project and upload the file
          createSponsorProject(options); // Pass options to create function
        }
      }
    }
  });
};

/**
 * [WATCH]: monitors the permissionStore value to ensure account permissions after refresh
 */
watch(
  () => permissionStore.needAccountRefresh,
  (newVal) => {
    if (newVal) {
      fetchData();
      permissionStore.setNeedAccountRefresh(false);
    }
  }
);

/**
 * [FUNCTION]: fetchData() query all active sponsor projects
 */
const fetchData = async () => {
  try {
    // [STEP]: Call backend api
    const response = await apiSwitch("querySponsorProjects");

    // [STEP]: Populate table
    if (response && response.data.data && Array.isArray(response.data.data)) {
      tableData.value = response.data.data.map((item) => ({
        projectId: item.id,
        projectName: item.name,
        projectType: projectTypeMap[item.type] || item.type,
        projectOrg: item.organization,
        projectUrl: item.url,
        projectMemo: item.memo,
        filepath: item.filepath,
      }));

      // TODO: decide file download method
      // [STEP]: Set the file path URL for download
      // if (tableData.value.length > 0) {
      //   console.log(tableData.value);
      //   uploadedFileUrl.value = tableData.value[0].filepath;
      // }

      // DEBUG: fetchData
      // console.log(uploadedFileUrl.value);
      console.log(isEditing.value);
      console.log(tableData.value);
    }
  } catch (error) {
    console.error("Error fetching userId details:", error);
  }
};

/**
 * [FUNCTION]: handleFileDownload() creates prefilled applications for download
 *
 * @param sponsorId
 */
const handleFileDownload = async (row) => {
  try {
    let selectedProject;
    if (selectedRows.value[0]) {
      selectedProject = selectedRows.value[0].projectId;
    } else {
      selectedProject = row.projectId;
    }
    // [STEP]: Collect case ID and sponsor ID
    const req = {
      sponsorId: selectedProject,
    };

    // [STEP]: Call backend api
    fetch("http://localhost:8081/api/sponsor/downloadOriginalApplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // [STEP]: Convert response to Blob
        return response.blob();
      })
      .then((blob) => {
        // [STEP]: Create URL for the Blob
        const url = window.URL.createObjectURL(blob);
        // [STEP]: Create a link element
        const a = document.createElement("a");
        // [STEP]: Set URL to element href
        a.href = url;
        // [STEP]: Set filename for download
        a.download = `${selectedProject.projectName}.docx`;
        // [STEP]: Append link to body
        document.body.appendChild(a);
        // [STEP]: Programmatically click the link to trigger the download
        a.click();
        // [STEP]: Remove the link from the document
        a.remove();
        // [STEP]: Clean up URL object
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error during file download:", error);
      });
  } catch (error) {
    console.error("Operation failed:", error);
    ElMessage.error("Download failed");
  }
};

/**
 * [HELPER]: projectTyepMap handels project type mapping
 */
const projectTypeMap = PROJECT_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

onMounted(() => {
  fetchData();
});

/**
 * [HELPER]: handleSelectionChange handles selected row change
 */
const selectedRows = ref([]);
const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

/**
 * [HELPER]: fileterTableData handles table search
 */
const search = ref("");
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      // [STEP]: Convert table data to strings to ensure search
      String(data.projectId)
        .toLowerCase()
        .includes(search.value.toLowerCase()) ||
      data.projectName.toLowerCase().includes(search.value.toLowerCase()) ||
      data.projectType.toLowerCase().includes(search.value.toLowerCase()) ||
      data.projectOrg.toLowerCase().includes(search.value.toLowerCase()) ||
      data.projectUrl.toLowerCase().includes(search.value.toLowerCase()) ||
      data.projectMemo.toLowerCase().includes(search.value.toLowerCase())
  )
);

/**
 * [HELPER] openCreateForm handles open/close of the create sponsor form
 */
const openCreateForm = () => {
  // [STEP] Clear form data
  resetForm();

  // [STEP]: Clear table selection
  if (multipleTable.value) {
    multipleTable.value.clearSelection();
  }

  // [STEP]: Open sponsor form
  sponsorForm.value = true;

  // [STEP]: Set form state to NOT editing
  isEditing.value = false;
};

/**
 * [HELPER] openEditForm handles open/close of the sponsor update form
 */
const openEditForm = () => {
  // [STEP] Clear form data
  resetForm();
  // [CASE]: Check if one row is selected
  if (selectedRows.value.length === 1) {
    // [STEP]: Populate the form with the original data from the selected row
    const selectedProject = selectedRows.value[0];
    form.projectId = selectedProject.projectId;
    form.projectName = selectedProject.projectName;
    form.projectOrg = selectedProject.projectOrg;
    form.projectType = selectedProject.projectType;
    form.projectUrl = selectedProject.projectUrl;
    form.projectMemo = selectedProject.projectMemo;
    uploadedFileUrl.value = selectedProject.filepath;
    console.log("uploadedFileUrl.value", uploadedFileUrl.value);

    // TODO: file is not handled currently

    // [STEP]: Set Editing mode to true
    isEditing.value = true;

    // [STEP]: Open sponsor form
    sponsorForm.value = true;
  } else {
    ElMessage.error("請選擇一個項目進行編輯");
  }
};

const updateSponsorProjectFile = (options) => {
  // [STEP]: Ensure form is in editing mode and only one row is selected
  // [CASE]: If form is NOT in editing mode and NOT only one row is selected
  if (!isEditing.value || selectedRows.value.length !== 1) {
    // [STEP]: Displat error message
    ElMessage.error("請選擇一行並確保處於編輯模式");
    return;
  }
  // [STEP]: Validate the input form.
  ruleRef.value.validate((valid) => {
    // [CASE]: If valid, create file, onSuccess, onError in options.
    if (valid) {
      const { file, onSuccess, onError } = options || {};
      // [CASE]: If NOT valid, log error and return.
      if (!form) {
        console.error("Form data is missing");
        return;
      }

      // [STEP]: Create formData object and append value from input.
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", form.projectId);

      // DEBUG: create sponsor project
      console.log(formData.get("file"));
      console.log(formData.get("id"));

      // [STEP]: Call backend api
      fetch("http://localhost:8081/api/sponsor/updateSponsorProjectFile", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          // [CASE]: Success response
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Upload failed");
          }
        })
        .then((data) => {
          // [STEP]: ?
          onSuccess(data);
          // [STEP]: Fetch data again to populate table with new created sponsor project
          fetchData();
          // [STEP]: Reset form
          resetForm();
          // [STEP]: Close sponsor form
          sponsorForm.value = false;

          // [STEP]: Clear table selection
          if (multipleTable.value) {
            multipleTable.value.clearSelection();
          }
        })
        .catch((err) => {
          // [CASE] Error response
          onError(err);
        });
    }
  });
};

/**
 * [FUNCTION]: updateSponsorProject() update sponsor project detail with new input data
 */
const updateSponsorProject = async () => {
  // [STEP]: Ensure form is in editing mode and only one row is selected
  // [CASE]: If form is NOT in editing mode and NOT only one row is selected
  if (!isEditing.value || selectedRows.value.length !== 1) {
    // [STEP]: Displat error message
    ElMessage.error("請選擇一行並確保處於編輯模式");
    return;
  }

  // [STEP]: Validate the form before proceeding
  ruleRef.value.validate(async (valid) => {
    // [CASE]: If form is valid, call backend api
    if (valid) {
      // [STEP]: Prepare request
      const reqBody = {
        sponsorId: form.projectId,
        name: form.projectName,
        organization: form.projectOrg,
        type: form.projectType,
        url: form.projectUrl,
        memo: form.projectMemo,
      };
      // DEBUG: updatesponsorproject api request
      console.log("API Request:", reqBody);

      try {
        // [STEP]: Call backend api
        const response = await apiSwitch("updateSponsorProject", reqBody);

        // DEBUG: updatesponsorproject api response
        console.log("API Response:", response.data);

        // [CASE]: If response Success
        if (response.data.code === "SUCCESS") {
          // [STEP]: Display success message
          ElMessage.success("補助方案編輯成功");
          // [STEP]: Refetch updated sponsor project list
          fetchData();
          // [STEP]: Reset form
          resetForm();

          // [STEP]: Close create sponsor form dialog
          sponsorForm.value = false;

          // [STEP]: Clear table selection
          if (multipleTable.value) {
            multipleTable.value.clearSelection();
          }
        } else {
          // [CASE]: If response NOT Success
          ElMessage.error("補助方案編輯失敗");
        }
      } catch (error) {
        // [ERROR]: Handle other error during process
        // [STEP]: Display error messsage
        ElMessage.error("補助方案編輯失敗");
      }
    } else {
      // [CASE]: If form is NOT valid
      // [STEP]: Display error message
      ElMessage.error("請填寫所有必填欄位");
    }
  });
};

/**
 * [FUNCION]: deleteSelectedRows() handles deletion of one or multiple sponsor projects
 */
const deleteSelectedRows = async () => {
  // [STEP]: Display deletion confirmation message
  ElMessageBox.confirm("確定要刪除選中的補助嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // [STEP]: Set selected sponsor ID
      const selectedIds = selectedRows.value.map((row) => row.projectId);
      // DEBUG: selected sponsor for deletion
      console.log("selectedIds", selectedIds);

      try {
        // [STEP]: Call backend api with selected sponsor ID
        await apiSwitch("deleteSponsorProjects", { sponsorIds: selectedIds });
        // [STEP]: Clear selected rows
        selectedRows.value = [];
        // [STEP]: Refetch updated sponsor project list
        fetchData();
        // [STEP]: Display success message
        ElMessage.success("成功刪除選中的補助");
        // [STEP]: Clear form data
        resetForm();
      } catch (error) {
        // [ERROR]: Handle other error during process
        // [STEP]: Display error message
        ElMessage.error("刪除帳號失敗");
      }
    })
    .catch(() => {
      // [CASE]: If deletion is canceled
      ElMessage.info("已取消删除");
    });
};

/**
 * [HELPER]: resetForm() clears all current data in the form
 */
const resetForm = () => {
  Object.assign(form, {
    // [STEP]: Clear all form values
    projectId: "",
    projectName: "",
    projectType: "",
    projectOrg: "",
    projectUrl: "",
    projectMemo: "",
    file: null,
  });

  // [STEP]: Clear all files from the upload component
  fileList.value = [];

  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }

  // [STEP] Reset file-related states
  uploadedFileUrl.value = null;

  // [STEP]: Close sponsor form
  sponsorForm.value = false;

  // [STEP]: End editing state
  isEditing.value = false;

  // [STEP]: Reset editing index
  editingIndex.value = -1;

  // [STEP] Reset form validation
  if (ruleRef.value) {
    ruleRef.value.resetFields();
  }
};

/**
 * [FUNCTION]: validateFile() checks if a file is included in the form
 *
 * @param rule
 * @param value
 * @param callback
 */
const validateFile = (rule, value, callback) => {
  if (uploadedFileUrl.value) {
    // DEBUG: application exists during update
    console.log("Application exist!", uploadedFileUrl.value);
    console.log("fileList.value.length!", fileList.value.length);

    callback();
  } else if (!fileList.value || fileList.value.length === 0) {
    console.log(fileList.value);
    callback(new Error("請上傳一份申請表(.docx格式)"));
  } else {
    callback();
  }
};

/**
 * [FUNCTION]: handleFileChange() manually updates fileListValue
 *
 * @param file
 * @param updatedFileList
 */
const handleFileChange = (file, updatedFileList) => {
  // DEBUG: Check update file
  console.log("Updated File List: ", updatedFileList);
  // [STEP]: Manually update fileList
  fileList.value = updatedFileList;
  // DEBUG: Check fileList length
  console.log(fileList.value.length);
};

/**
 * [VARIABLE]: rules stores the form validation rules
 */
const rules = reactive({
  projectName: [
    { required: true, message: "請輸入補助方案補助名稱", trigger: "blur" },
  ],
  projectType: [
    { required: true, message: "請輸入補助方案類型", trigger: "change" },
  ],
  projectOrg: [
    { required: true, message: "請輸入補助方案提供單位", trigger: "blur" },
  ],
  projectUrl: [
    { required: true, message: "請輸入補助方案網站", trigger: "blur" },
  ],
  file: [{ required: true, validator: validateFile, trigger: "change" }],
});

// [VARIABLE]: pageSize stores the number of items to display per page
const pageSize = ref(10);
// [VARIABLE]: currentPage stores the current page number
const currentPage = ref(1);

// [HELPER]: paginatedData() computes the number of item to display per page
const paginatedData = computed(() => {
  // [STEP]: Calculate starting index for the current page
  const start = (currentPage.value - 1) * pageSize.value;
  // [STEP]: Calculate ending index for the current page
  const end = start + pageSize.value;
  // [STEP]: Slice original data set and return the items to be displayed
  return filterTableData.value.slice(start, end);
});

/**
 * [HELPER]: handleSizeChange() handles pageSize changes from dropdown
 * @param newSize
 */
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

/**
 * [HELPER]: handleCurrentChange() handles navigation between pages
 * @param newPage
 */
const handleCurrentChange = (newPage) => {
  // [STEP]: Set new current page value
  currentPage.value = newPage;
};

/**
 * [HELPER]: filteredDataLength() computes the current total number of items after filtering
 */
const filteredDataLength = computed(() => {
  return filterTableData.value.length;
});

/**
 * [WATCH]: monitors the filteredDataLength value to ensure page change when item number change after filter
 */
watch(filteredDataLength, (newLength) => {
  // [CASE]: If current page exceeds the total number of available items
  if (newLength < pageSize.value * (currentPage.value - 1)) {
    // [STEP]: Reset currentPage to 1
    currentPage.value = 1;
  }
});

/**
 * [HELPER]: closeForm handles close of the sponsor form
 */
const closeForm = () => {
  // [STEP]: Clear form data
  resetForm();

  // [STEP]: Clear table selection
  if (multipleTable.value) {
    multipleTable.value.clearSelection();
  }

  // DEBUG closeForm
  console.log("closeForm clicked");
  fetchData();
  console.log("fetch data clicked");
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

:deep(.el-form-item__label) {
  align-items: center; /* Vertically center-align content */
  justify-content: flex-start;
  padding: 0 8px 0 0;
}

.dialog-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0px 50px;
}
</style>

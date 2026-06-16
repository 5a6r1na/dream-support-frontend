// /src/stores/caseStore.js
import { defineStore } from "pinia";

export const useCaseStore = defineStore("case", {
  state: () => ({
    selectedCase: null,
    active: null,
    isEditing: false,
    isSave: false,
    isCancel: false,
    isCreatingHistory: false,
    isSelectHistory: false,
  }),

  actions: {
    setSelectedCase(caseData) {
      this.selectedCase = caseData;
      console.log("selectedCase set to:", caseData);
    },
    setActive(activeTab) {
      this.active = activeTab;
      console.log("active tab set to:", activeTab);
    },
    setEditing(value) {
      this.isEditing = value;
      console.log("isEditing:", value);
    },
    triggerSave() {
      this.isSave = true;
      setTimeout(() => (this.isSave = false), 0);
      console.log("triggerSave");
    },
    triggerCancel() {
      this.isCancel = true;
      setTimeout(() => (this.isCancel = false), 0);
      console.log("triggerCancel");
    },
    triggerCreateCaseHistory() {
      this.isCreatingHistory = !this.isCreatingHistory;
      console.log("triggerCreateCaseHistory", this.isCreatingHistory);
    },
    setSelectedHistory(value) {
      this.isSelectHistory = value;
      console.log("historySelected", this.isSelectHistory);
    },
  },
});

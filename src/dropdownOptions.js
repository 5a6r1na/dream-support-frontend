// Aside Icons
const ASIDE_ICONS = {
  home: () => import("/aside/home-solid-24.png"),
  casemanagement: () => import("/aside/group-solid-24.png"),
  sponsormanagement: () => import("/aside/donate-heart-solid-24.png"),
  accountmanagement: () => import("/aside/check-shield-regular-24.png"),
  chevronRight: () => import("/aside/chevron-right-regular-24.png"),
  chevronLeft: () => import("/aside/chevron-left-regular-24.png"),
};

// Case type options
const CASE_TYPE_OPTIONS = [
  { label: "低收入", value: "lowincome" },
  { label: "原住民", value: "indigenous" },
  { label: "榮民", value: "veteran" },
];

// Case type options
const FAMILY_INCOME_OPTIONS = [
  { label: "全戶均無收入", value: "0" },
  { label: "大於0元，小於等於2,807元", value: "1" },
  { label: "大於2,807元，小於等於9,263元", value: "2" },
  { label: "大於9,263元，小於等於14,036元", value: "3" },
  { label: "大於14,036元，小於等於19,649元", value: "4" },
];

// Project type options
const PROJECT_TYPE_OPTIONS = [
  { label: "急難救助", value: "1" },
  { label: "獎助學金", value: "2" },
];

const PROJECT_NAME_OPTIONS = [
  { label: "急難救助", value: "1" },
  { label: "獎助學金", value: "2" },
];

export {
  ASIDE_ICONS,
  CASE_TYPE_OPTIONS,
  FAMILY_INCOME_OPTIONS,
  PROJECT_TYPE_OPTIONS,
};

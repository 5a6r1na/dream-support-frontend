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
  { label: "中低收入戶", value: "lowmiddleincome" },
  { label: "高齡者（65歲以上）", value: "elderly" },
  { label: "無家者", value: "homeless" },
  { label: "移工", value: "migrantworker" },
  { label: "新移民", value: "newimmigrant" },
  { label: "原住民", value: "indigenous" },
  { label: "單親家庭", value: "singleparent" },
  { label: "隔代教養家庭", value: "grandparentcare" },
  { label: "特殊境遇家庭", value: "specialcircumstances" },
  { label: "身心障礙者", value: "disabled" },
  {
    label: "安置機構、寄養家庭結束安置無法返家，未滿二十五歲",
    value: "youthinstability",
  },
  { label: "受家庭暴力或性侵害之受害者及其子女", value: "dv_victim" },
  { label: "因懷孕或生育而遭遇困境之未成年人", value: "pregnant_minor" },
  { label: "災民", value: "disastervictim" },
  {
    label: "感染人類免疫缺乏病毒者或罹患後天免疫缺乏症候群者",
    value: "hiv_aids",
  },
  { label: "經濟弱勢家庭", value: "economically_disadvantaged" },
  { label: "清寒家庭", value: "impoverished" },
];

// Family income options
const FAMILY_INCOME_OPTIONS = [
  { label: "全戶均無收入", value: "0" },
  { label: "大於0元，小於等於2,807元", value: "1" },
  { label: "大於2,807元，小於等於9,263元", value: "2" },
  { label: "大於9,263元，小於等於14,036元", value: "3" },
  { label: "大於14,036元，小於等於19,649元", value: "4" },
];

// Income source options
const INCOME_SOURCE_OPTIONS = [
  { value: "employment", label: "受僱薪資收入" },
  { value: "self_employed", label: "自營作業收入" },
  { value: "social_welfare", label: "社會福利補助" },
  { value: "family_support", label: "家庭支援（親友資助）" },
  { value: "none", label: "無固定收入／無收入" },
];

// cohabitant options
const COHABITANT_OPTIONS = [
  { value: "spouse", label: "配偶" },
  { value: "parents", label: "父母" },
  { value: "children", label: "子女" },
  { value: "relatives", label: "其他親屬" },
  { value: "none", label: "獨居／無同住者" },
];

// Project type options
const PROJECT_TYPE_OPTIONS = [
  { label: "家庭/個人急難救助金", value: "1" },
  { label: "喪葬補助", value: "2" },
  { label: "獎助學金", value: "3" },
  { label: "醫療補助", value: "4" },
  { label: "生活扶助", value: "5" },
  { label: "教育補貼", value: "6" },
];

const PROJECT_RESULT_OPTIONS = [
  { label: "成功", value: "1" },
  { label: "失敗", value: "2" },
  { label: "取消", value: "3" },
];

export {
  ASIDE_ICONS,
  CASE_TYPE_OPTIONS,
  FAMILY_INCOME_OPTIONS,
  INCOME_SOURCE_OPTIONS,
  COHABITANT_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  PROJECT_RESULT_OPTIONS,
};

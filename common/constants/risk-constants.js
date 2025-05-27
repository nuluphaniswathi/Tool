export const riskSourcesList = [
  "Organizational -Employee / Staff Availability",
  "Organizational -Skills/Experience",
  "Organizational -Training",
  "Organizational -Process",
  "Organizational -Work Environment",
  "Management -Scope",
  "Management -Stakeholders",
  "Management -Prioritization",
  "Management -Project Dependencies",
  "Management -Estimating",
  "Management -Planning",
  "Management -Monitoring & Control",
  "Management -Schedule",
  "Management -Cost & Budget",
  "Management -Communications",
  "Management -Change Management",
  "Development -Business Requirements",
  "Development -Technical Requirements",
  "Development -Technology",
  "Development -Technical Environment",
  "Development -Interfaces",
  "Product -Usability",
  "Product -Reliability",
  "Product -Capacity",
  "Product -Scalability",
  "Product -Performance",
  "Product -Complexity",
  "Product -Supportability",
  "Product -Security",
  "External -Subcontractors and Suppliers",
  "External -External Vendor",
  "External -Regulatory",
  "External -Market",
  "External -Customer",
];

export const riskCategoryList = [
  "Organizational",
  "Management",
  "Development",
  "Product",
  "External",
];

export const riskStatus = [
  "Identified",
  "Under Mitigation",
  "Mitigated",
  "Closed",
];

export const riskStatusOptions = [
  { value: "Identified", label: "Identified" },
  { value: "Under Mitigation", label: "Under Mitigation" },
  { value: "Mitigated", label: "Mitigated" },
  { value: "Closed", label: "Closed" },
];

export const riskPriorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const gdoFilter = [
  { name: "gdo_name", key: "GDO 1", value: "GDO_1", label: "GDO 1" },
  { name: "gdo_name", key: "GDO 2", value: "GDO_2", label: "GDO 2" },
  { name: "gdo_name", key: "GDO 3", value: "GDO_3", label: "GDO 3" },
  { name: "gdo_name", key: "GDO 4", value: "GDO_4", label: "GDO 4" },
  { name: "gdo_name", key: "GDO 5", value: "GDO_5", label: "GDO 5" },
  { name: "gdo_name", key: "GDO 6", value: "GDO_6", label: "GDO 6" },
  { name: "gdo_name", key: "GDO 7", value: "GDO_7", label: "GDO 7" },
  { name: "gdo_name", key: "GDO 8", value: "GDO_8", label: "GDO 8" },
  { name: "gdo_name", key: "GDO WL", value: "GDO_WL", label: "GDO WL" },
  { name: "gdo_name", key: "DAI", value: "DAI", label: "DAI" },
  { name: "gdo_name", key: "CI4.0", value: "CI4.0", label: "CI4.0" },
];

export const gdoFilters = [
  { value: "1", label: "GDO 1" },
  { value: "2", label: "GDO 2" },
  { value: "3", label: "GDO 3" },
  { value: "4", label: "GDO 4" },
  { value: "GDO_WL", label: "GDO WL" },
];

export const dateFilterForDeliveryGovernance = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "last-week", label: "Last Week" },
  { value: "this-month", label: "Last 30 Days" },
];

export const dateFilter = [
  { value: "this-week", label: "This Week" },
  { value: "last-week", label: "Last Week" },
  { value: "this-month", label: "Last 30 Days" },
];

export const projectStatus = [
  { value: "on_track", label: "On Track"},
  { value: "needs_attention", label: "Needs Attention"},
  { value: "under_risk", label: "Under Risk"}
];

export const accountStatus = [
  {value: null, label: "Select Status"},
  { value: "green", label: "On Track"},
  { value: "orange", label: "Needs Attention"},
  { value: "orangered", label: "Under Risk"}
];
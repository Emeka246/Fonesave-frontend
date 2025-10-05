export const deviceBrands = [
    "Apple", "Google", "Huawei", "Infinix", "LG", "Motorola", "Nokia", "OnePlus",
    "Oppo", "Realme", "Redmi", "Samsung", "Sony", "Tecno", "Vivo", "Xiaomi", "Other"
]
  
export const deviceConditions = [
{ value: "new", label: "New", color: "green" },
{ value: "like-new", label: "Like New", color: "blue" },
{ value: "good", label: "Good", color: "yellow" },
{ value: "fair", label: "Fair", color: "orange" },
{ value: "poor", label: "Poor", color: "red" }
]


export const operatingSystems = [
"iOS", "Android", "Windows", "Other"
]

export const deviceStatuses = [
{ value: "CLEAN", label: "Clean/Safe", description: "Device is not reported as stolen or lost", color: "green" },
{ value: "STOLEN", label: "Stolen", description: "Device has been reported as stolen", color: "red" },
{ value: "LOST", label: "Lost", description: "Device has been reported as lost", color: "orange" },
{ value: "BLOCKED", label: "Blocked", description: "Device is blocked by carrier", color: "red" },
{ value: "UNKNOWN", label: "Unknown", description: "Status cannot be determined", color: "gray" }
]
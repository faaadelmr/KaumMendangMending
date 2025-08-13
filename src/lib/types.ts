
export type Spec = {
  // GENERAL
  brand: string;
  color: string;
  dimensions: string; // WxHxT
  
  // LAUNCH
  announced: string;

  // DISPLAY
  displaySize: string;
  displayResolution: string;
  displayProtection: string;

  // PLATFORM
  os: string;
  osUpdate: string;
  processorChipset: string;
  processorCpu: string;
  processorGpu: string;

  // STORAGE
  storageRam: string;
  storageType: string;
  ramType: string;

  // MAIN CAMERA
  mainCameraModules: string;
  mainCameraFeatures: string;
  mainCameraVideo: string;

  // SELFIE CAMERA
  selfieCameraModules: string;
  selfieCameraFeatures: string;
  selfieCameraVideo: string;

  // COMMS
  nfc: string;
  ipRating: string;
  sim: string;
  usb: string;
  bluetooth: string;

  // FEATURES
  sensors: string;

  // BATTERY
  batteryType: string;
  batteryCharging: string;

  // MISC
  price: string;
  
  // BENCHMARKS
  geekbenchSingle: string;
  geekbenchMulti: string;
  antutu: string;
  threeDMark: string;
};

export type Phone = {
  id: number;
  brand: string;
  model: string;
  specs: Spec;
};

export const specLabels: Record<keyof Spec, string> = {
  brand: "Brand",
  color: "Color",
  dimensions: "Dimensions (WxHxT)",
  announced: "Announced",
  displaySize: "Size",
  displayResolution: "Resolution",
  displayProtection: "Protection",
  os: "OS",
  osUpdate: "OS Update Promise",
  processorChipset: "Chipset",
  processorCpu: "CPU",
  processorGpu: "GPU",
  storageRam: "Storage & RAM",
  storageType: "Storage Type",
  ramType: "RAM Type",
  mainCameraModules: "Modules",
  mainCameraFeatures: "Features",
  mainCameraVideo: "Video",
  selfieCameraModules: "Modules",
  selfieCameraFeatures: "Features",
  selfieCameraVideo: "Video",
  nfc: "NFC",
  ipRating: "IP Rating",
  sim: "SIM",
  usb: "Charging Port",
  bluetooth: "Bluetooth",
  sensors: "Sensors",
  batteryType: "Battery",
  batteryCharging: "Charging",
  price: "Price (IDR) *Estimasi",
  geekbenchSingle: "Geekbench 6 (Single)",
  geekbenchMulti: "Geekbench 6 (Multi)",
  antutu: "AnTuTu",
  threeDMark: "3DMark (Wild Life)",
};

// LAPTOP TYPES

export type LaptopSpec = {
  // GENERAL
  price: string;
  releaseYear: string;
  type: string;
  color: string;

  // PERFORMANCE
  processor: string;
  graphics: string;
  flops: string;
  executionUnits: string;
  tgp: string;
  ram: string;
  storage: string;
  coolingSystem: string;

  // DISPLAY
  displaySize: string;
  displayResolution: string;
  aspectRatio: string;
  displayPanelType: string;
  sRgbCoverage: string;
  displayBrightness: string;
  displayRefreshRate: string;
  touchscreen: string;

  // DESIGN & PORTABILITY
  weight: string;
  dimensions: string; // W x H x T
  material: string;

  // CONNECTIVITY & FEATURES
  ports: string;
  webcam: string;
  backlitKeyboard: string;
  fingerprintReader: string;
  
  // BATTERY
  batteryCapacity: string;
  batteryLife: string;

  // BENCHMARKS
  geekbenchSingle: string;
  geekbenchMulti: string;
  cinebenchSingle: string;
  cinebenchMulti: string;
  pcMark10: string;
};

export type Laptop = {
  id: number;
  brand: string;
  model: string;
  specs: LaptopSpec;
}

export const laptopSpecLabels: Record<keyof LaptopSpec, string> = {
  price: "Price (IDR) *Estimasi",
  releaseYear: "Release Year",
  type: "Type",
  color: "Color",
  processor: "Processor",
  graphics: "Graphics Card",
  flops: "FLOPS (FP32)",
  executionUnits: "Execution Units (EU)",
  tgp: "TGP",
  ram: "RAM",
  storage: "Storage",
  displaySize: "Display Size",
  displayResolution: "Display Resolution",
  aspectRatio: "Aspect Ratio",
  displayPanelType: "Panel Type",
  sRgbCoverage: "sRGB Coverage",
  displayBrightness: "Brightness",
  displayRefreshRate: "Refresh Rate",
  touchscreen: "Touchscreen",
  weight: "Weight",
  dimensions: "Size (WxHxT)",
  material: "Material",
  ports: "Ports",
  webcam: "Webcam",
  backlitKeyboard: "Backlit Keyboard",
  fingerprintReader: "Fingerprint Reader",
  batteryCapacity: "Battery Capacity",
  batteryLife: "Est. Battery Life",
  coolingSystem: "Cooling System",
  geekbenchSingle: "Geekbench 6 (Single)",
  geekbenchMulti: "Geekbench 6 (Multi)",
  cinebenchSingle: "Cinebench (Single)",
  cinebenchMulti: "Cinebench (Multi)",
  pcMark10: "PCMark 10",
};

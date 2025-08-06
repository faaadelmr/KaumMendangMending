
export type Spec = {
  // GENERAL
  brand: string;
  color: string;
  
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

  // FEATURES
  sensors: string;

  // BATTERY
  batteryType: string;
  batteryCharging: string;

  // MISC
  price: string;
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
  sensors: "Sensors",
  batteryType: "Battery",
  batteryCharging: "Charging",
  price: "Price (IDR)",
};

// LAPTOP TYPES

export type LaptopSpec = {
  // GENERAL
  price: string;
  releaseYear: string;
  color: string;

  // PERFORMANCE
  processor: string;
  graphics: string;
  ram: string;
  storage: string;

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
  ports: string;
  webcam: string;
  backlitKeyboard: string;
  fingerprintReader: string;
  
  // BATTERY & FEATURES
  batteryCapacity: string;
  batteryLife: string;
  coolingSystem: string;

  // BENCHMARKS
  geekbenchSingle: string;
  geekbenchMulti: string;
};

export type Laptop = {
  id: number;
  brand: string;
  model: string;
  specs: LaptopSpec;
}

export const laptopSpecLabels: Record<keyof LaptopSpec, string> = {
  price: "Price (IDR)",
  releaseYear: "Release Year",
  color: "Color",
  processor: "Processor",
  graphics: "Graphics Card",
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
};


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
  displaySize: "Display Size",
  displayResolution: "Display Resolution",
  displayProtection: "Display Protection",
  os: "OS",
  osUpdate: "OS Update Promise",
  processorChipset: "Chipset",
  processorCpu: "CPU",
  processorGpu: "GPU",
  storageRam: "Storage & RAM",
  mainCameraModules: "Main Camera Modules",
  mainCameraFeatures: "Main Camera Features",
  mainCameraVideo: "Main Camera Video",
  selfieCameraModules: "Selfie Camera Modules",
  selfieCameraFeatures: "Selfie Camera Features",
  selfieCameraVideo: "Selfie Camera Video",
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

  // PERFORMANCE
  processor: string;
  graphics: string;
  ram: string;
  storage: string;

  // DISPLAY
  displaySize: string;
  displayResolution: string;
  displayPanelType: string;
  displayRefreshRate: string;

  // DESIGN & PORTABILITY
  weight: string;
  ports: string;
  webcam: string;
  
  // BATTERY
  batteryCapacity: string;
  batteryLife: string;
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
  processor: "Processor",
  graphics: "Graphics Card",
  ram: "RAM",
  storage: "Storage",
  displaySize: "Display Size",
  displayResolution: "Display Resolution",
  displayPanelType: "Panel Type",
  displayRefreshRate: "Refresh Rate",
  weight: "Weight",
  ports: "Ports",
  webcam: "Webcam",
  batteryCapacity: "Battery Capacity",
  batteryLife: "Est. Battery Life",
};

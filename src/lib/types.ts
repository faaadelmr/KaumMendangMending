
export type Spec = {
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
  usb: "Charging Port",
  sensors: "Sensors",
  batteryType: "Battery",
  batteryCharging: "Charging",
  price: "Price",
};

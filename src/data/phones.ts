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
  image: string;
  specs: Spec;
  reviews: string[];
};

export const phones: Phone[] = [
  {
    id: 1,
    brand: 'Pixel',
    model: 'G-Phone 8 Pro',
    image: 'https://placehold.co/400x400.png',
    specs: {
      announced: "2023, October 4",
      displaySize: "6.7 inches",
      displayResolution: "1344 x 2992 pixels",
      displayProtection: "Gorilla Glass Victus 2",
      os: "Android 14",
      osUpdate: "7 years of OS updates",
      processorChipset: "Tensor G3 (4 nm)",
      processorCpu: "Nona-core",
      processorGpu: "Immortalis-G715s MC10",
      storageRam: "128GB 12GB RAM, 256GB 12GB RAM, 512GB 12GB RAM, 1TB 12GB RAM",
      mainCameraModules: "50MP (wide), 48MP (telephoto), 48MP (ultrawide)",
      mainCameraFeatures: "Pixel Shift, Ultra-HDR, Magic Editor",
      mainCameraVideo: "4K@30/60fps, 1080p@30/60/120/240fps",
      selfieCameraModules: "10.5MP (ultrawide)",
      selfieCameraFeatures: "Auto-HDR, panorama",
      selfieCameraVideo: "4K@24/30/60fps, 1080p@30/60fps",
      nfc: "Yes",
      usb: "USB Type-C 3.2",
      sensors: "Fingerprint (under display, optical), accelerometer, gyro, proximity, compass, barometer, thermometer (skin)",
      batteryType: "Li-Ion 5050 mAh, non-removable",
      batteryCharging: "30W wired, PD3.0, PPS, 50% in 30 min (advertised), 23W wireless, Reverse wireless",
      price: '$999',
    },
    reviews: [
      'The camera is absolutely mind-blowing, especially in low light.',
      'Performance is smooth for everyday tasks, but it can get a bit warm when gaming.',
      'Battery life is decent, gets me through a full day with moderate use.',
      'The screen is bright and beautiful. A joy to watch videos on.',
      'I wish the charging was faster. It feels a bit slow compared to competitors.',
    ],
  },
  {
    id: 2,
    brand: 'Apex',
    model: 'Galaxy Z24 Ultra',
    image: 'https://placehold.co/400x400.png',
    specs: {
      announced: "2024, January 17",
      displaySize: "6.8 inches",
      displayResolution: "1440 x 3120 pixels",
      displayProtection: "Gorilla Armor",
      os: "Android 14, One UI 6.1",
      osUpdate: "7 years of OS/security updates",
      processorChipset: "Snapdragon 8 Gen 3 for Galaxy (4 nm)",
      processorCpu: "Octa-core",
      processorGpu: "Adreno 750 (1 GHz)",
      storageRam: "256GB 12GB RAM, 512GB 12GB RAM, 1TB 12GB RAM",
      mainCameraModules: "200MP (wide), 50MP (periscope telephoto), 10MP (telephoto), 12MP (ultrawide)",
      mainCameraFeatures: "LED flash, auto-HDR, panorama",
      mainCameraVideo: "8K@24/30fps, 4K@30/60/120fps, 1080p@30/60/240fps, 1080p@960fps",
      selfieCameraModules: "12MP (wide)",
      selfieCameraFeatures: "Dual video call, Auto-HDR, HDR10+",
      selfieCameraVideo: "4K@30/60fps, 1080p@30fps",
      nfc: "Yes",
      usb: "USB Type-C 3.2, OTG",
      sensors: "Fingerprint (under display, ultrasonic), accelerometer, gyro, proximity, compass, barometer",
      batteryType: "Li-Ion 5000 mAh, non-removable",
      batteryCharging: "45W wired, PD3.0, 65% in 30 min (advertised), 15W wireless (Qi/PMA), 4.5W reverse wireless",
      price: '$1299',
    },
    reviews: [
      'This phone is a productivity powerhouse. The built-in stylus is a game-changer.',
      'The zoom on the camera is insane. You can capture details from so far away.',
      'It\'s a very expensive device, but it feels incredibly premium.',
      'The battery easily lasts me a day and a half. No complaints there.',
      'The flat screen is a huge improvement over the curved edges of previous models.',
    ],
  },
  {
    id: 3,
    brand: 'Orchard',
    model: 'iFruit 15 Pro',
    image: 'https://placehold.co/400x400.png',
    specs: {
      announced: "2023, September 12",
      displaySize: "6.1 inches",
      displayResolution: "1179 x 2556 pixels",
      displayProtection: "Ceramic Shield glass",
      os: "iOS 17, upgradable to iOS 17.5.1",
      osUpdate: "Up to 5-6 years of OS updates",
      processorChipset: "A17 Pro (3 nm)",
      processorCpu: "Hexa-core (2x3.78 GHz + 4x2.11 GHz)",
      processorGpu: "Apple GPU (6-core graphics)",
      storageRam: "128GB 8GB RAM, 256GB 8GB RAM, 512GB 8GB RAM, 1TB 8GB RAM",
      mainCameraModules: "48MP (wide), 12MP (telephoto), 12MP (ultrawide)",
      mainCameraFeatures: "Dual-LED dual-tone flash, HDR (photo/panorama)",
      mainCameraVideo: "4K@24/25/30/60fps, 1080p@25/30/60/120/240fps, 10-bit HDR, Dolby Vision HDR (up to 60fps), ProRes, Cinematic mode",
      selfieCameraModules: "12MP (wide)",
      selfieCameraFeatures: "HDR, Cinematic mode (4K@24/30fps)",
      selfieCameraVideo: "4K@24/25/30/60fps, 1080p@25/30/60/120fps",
      nfc: "Yes",
      usb: "USB Type-C 3.0, DisplayPort",
      sensors: "Face ID, accelerometer, gyro, proximity, compass, barometer",
      batteryType: "Li-Ion 3274 mAh, non-removable",
      batteryCharging: "Wired, PD2.0, 50% in 30 min (advertised), 15W wireless (MagSafe), 7.5W wireless (Qi), 4.5W reverse wired",
      price: '$999',
    },
    reviews: [
      'The ecosystem is just seamless. Everything works perfectly with my other Orchard devices.',
      'Video recording quality is the best in the business. So smooth and stable.',
      'I was worried about the battery size, but it performs surprisingly well.',
      'The new Action Button is more useful than I thought it would be.',
      'It\'s fast, fluid, and the build quality is top-notch as always.',
    ],
  },
  {
    id: 4,
    brand: 'OneMore',
    model: '12 Pro',
    image: 'https://placehold.co/400x400.png',
    specs: {
      announced: "2024, January 23",
      displaySize: "6.82 inches",
      displayResolution: "1440 x 3168 pixels",
      displayProtection: "Gorilla Glass Victus 2",
      os: "Android 14, OxygenOS 14",
      osUpdate: "4 years OS, 5 years security updates",
      processorChipset: "Snapdragon 8 Gen 3 (4 nm)",
      processorCpu: "Octa-core",
      processorGpu: "Adreno 750",
      storageRam: "256GB 12GB RAM, 512GB 16GB RAM",
      mainCameraModules: "50MP (wide), 64MP (periscope telephoto), 48MP (ultrawide)",
      mainCameraFeatures: "Hasselblad Color Calibration, Dual-LED flash, HDR, panorama",
      mainCameraVideo: "8K@24fps, 4K@30/60fps, 1080p@30/60/240/480fps, Auto HDR, gyro-EIS, Dolby Vision",
      selfieCameraModules: "32MP (wide)",
      selfieCameraFeatures: "Auto-HDR, panorama",
      selfieCameraVideo: "4K@30fps, 1080p@30fps",
      nfc: "Yes",
      usb: "USB Type-C 3.2, OTG",
      sensors: "Fingerprint (under display, optical), accelerometer, gyro, proximity, compass, color spectrum",
      batteryType: "Li-Po 5400 mAh, non-removable",
      batteryCharging: "100W wired, 1-100% in 26 min (advertised), 50W wireless, 1-100% in 55 min (advertised), 10W reverse wireless",
      price: '$899',
    },
    reviews: [
      'The charging speed is unbelievable. A full charge in under 30 minutes!',
      'Incredible value for the money. Flagship specs at a lower price.',
      'The software is clean and close to stock Android, which I love.',
      'Camera quality is great, but sometimes the colors can look a bit oversaturated.',
      'The battery life is phenomenal. This thing is a two-day phone, easy.',
    ],
  },
];

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

export type Spec = {
  display: string;
  camera: string;
  battery: string;
  processor: string;
  storage: string;
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
      display: '6.7" Super Actua',
      camera: '50MP Wide',
      battery: '5050 mAh',
      processor: 'Tensor G3',
      storage: '256 GB',
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
      display: '6.8" Dynamic AMOLED',
      camera: '200MP Wide',
      battery: '5000 mAh',
      processor: 'Snapdragon 9 Gen 3',
      storage: '512 GB',
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
      display: '6.1" Super Retina',
      camera: '48MP Main',
      battery: '3274 mAh',
      processor: 'A17 Pro',
      storage: '256 GB',
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
      display: '6.82" ProXDR',
      camera: '50MP Wide',
      battery: '5400 mAh',
      processor: 'Snapdragon 9 Gen 3',
      storage: '512 GB',
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
  display: "Display",
  camera: "Camera",
  battery: "Battery",
  processor: "Processor",
  storage: "Storage",
  price: "Price",
};

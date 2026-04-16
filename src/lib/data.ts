import type { Product, Category } from './types';

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Teclado Mecánico RGB',
    description: 'Switches Gateron Brown, ergonómico, 104 teclas.',
    price: 89.99,
    imageId: 'keyboard',
    stock: 15,
    category: 'Periféricos',
  },
  {
    id: 'prod_002',
    name: 'Ratón Inalámbrico Ergo',
    description: '6 botones, DPI ajustable hasta 1600.',
    price: 29.50,
    imageId: 'mouse',
    stock: 30,
    category: 'Periféricos',
  },
  {
    id: 'prod_003',
    name: 'Monitor Curvo 27"',
    description: 'Panel VA, Full HD, 144Hz, 1ms, FreeSync.',
    price: 299.00,
    imageId: 'monitor',
    stock: 8,
    category: 'Monitores',
  },
  {
    id: 'prod_004',
    name: 'Auriculares Gaming 7.1',
    description: 'Sonido envolvente, micrófono retráctil.',
    price: 59.99,
    imageId: 'headset',
    stock: 22,
    category: 'Audio',
  },
  {
    id: 'prod_005',
    name: 'Webcam HD 1080p',
    description: '30fps, enfoque automático, micrófono dual.',
    price: 45.00,
    imageId: 'webcam',
    stock: 12,
    category: 'Cámaras',
  },
  {
    id: 'prod_006',
    name: 'Silla de Oficina ErgoMax',
    description: 'Soporte lumbar ajustable, reposabrazos 4D.',
    price: 220.00,
    imageId: 'chair',
    stock: 5,
    category: 'Muebles',
  },
];

export const categories: Category[] = [
  {
    id: 'cat_001',
    name: 'Periféricos',
    imageId: 'keyboard',
  },
  {
    id: 'cat_002',
    name: 'Monitores',
    imageId: 'monitor',
  },
  {
    id: 'cat_003',
    name: 'Audio',
    imageId: 'headset',
  },
  {
    id: 'cat_004',
    name: 'Muebles',
    imageId: 'chair',
  },
];

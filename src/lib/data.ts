import type { Product, Category } from './types';

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Teclado Mecánico RGB',
    description: 'Teclado mecánico retroiluminado con switches Gateron Brown, diseño ergonómico y 104 teclas. Ideal para gaming y trabajo.',
    price: 89.99,
    imageId: 'keyboard',
    stock: 15,
    category: 'Periféricos',
  },
  {
    id: 'prod_002',
    name: 'Ratón Inalámbrico Ergo',
    description: 'Ratón óptico inalámbrico con diseño ergonómico, 6 botones programables y DPI ajustable (hasta 1600).',
    price: 29.50,
    imageId: 'mouse',
    stock: 30,
    category: 'Periféricos',
  },
  {
    id: 'prod_003',
    name: 'Monitor Curvo 27"',
    description: 'Monitor de 27 pulgadas con panel VA curvo, resolución Full HD, 144Hz de tasa de refresco y 1ms de tiempo de respuesta. Compatible con FreeSync.',
    price: 299.00,
    imageId: 'monitor',
    stock: 8,
    category: 'Monitores',
  },
  {
    id: 'prod_004',
    name: 'Auriculares Gaming 7.1',
    description: 'Auriculares estéreo con sonido envolvente 7.1, micrófono retráctil con cancelación de ruido y almohadillas de memoria para máxima comodidad.',
    price: 59.99,
    imageId: 'headset',
    stock: 22,
    category: 'Audio',
  },
  {
    id: 'prod_005',
    name: 'Webcam HD 1080p',
    description: 'Webcam con resolución Full HD 1080p a 30fps, enfoque automático y micrófono dual integrado. Perfecta para videollamadas y streaming.',
    price: 45.00,
    imageId: 'webcam',
    stock: 12,
    category: 'Cámaras',
  },
  {
    id: 'prod_006',
    name: 'Silla de Oficina ErgoMax',
    description: 'Silla ergonómica con soporte lumbar ajustable, reposabrazos 4D y malla transpirable para máxima comodidad durante largas jornadas.',
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

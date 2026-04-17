const MINIO_BASE = 'https://storage.rpyasociados.tech';
const PRODUCTS_BUCKET = 'products';

export function getProductImageUrl(filename: string): string {
  return `${MINIO_BASE}/${PRODUCTS_BUCKET}/${filename}`;
}

export function getStorageUrl(bucket: string, filename: string): string {
  return `${MINIO_BASE}/${bucket}/${filename}`;
}

export const STORAGE = {
  baseUrl: MINIO_BASE,
  buckets: {
    products: PRODUCTS_BUCKET,
    backups: 'coolify-backups',
  },
} as const;

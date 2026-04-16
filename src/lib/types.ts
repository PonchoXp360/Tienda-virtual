export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  stock: number;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  imageId: string;
};

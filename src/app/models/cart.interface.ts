export interface CartItem {
  id: number;
  title?: string;
  isCategory?: boolean;
  price?: number;
  count?: number;
  categoryId?: number;
  image?: string;
  color?: string;
  options?: {
    title: string;
    price: number;
  }[];
};
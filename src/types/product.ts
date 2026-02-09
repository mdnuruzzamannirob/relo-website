export type Product = {
  id: string;
  userId: string;
  title: string;
  price: number;
  brandName?: string;
  size?: string;
  condition?: string;
  description?: string;
  photos?: string[];
  lockerSize?: string;
  categoryId?: string;
  locationId?: string;
  isPublic?: boolean;
  isSold?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type ProductListResponse = {
  success: boolean;
  message: string;
  data: {
    meta: ProductListMeta;
    result: Product[];
  };
};

export type ProductDetailsResponse = {
  success: boolean;
  message: string;
  data: Product;
};

export type FavoriteProduct = {
  id: string;
  product: Product;
};

export type MyFavoriteProductsResponse = {
  success: boolean;
  message: string;
  data: FavoriteProduct[];
};
export type CategoriesLockerResponse = {
  success: boolean;
  message: string;
  data: {
    meta: { page: number; limit: number; total: number; totalPage: number };
    categories: any[];
  };
};

export type ProductListParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  myProducts?: boolean;
  isActive?: boolean;
};

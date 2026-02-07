import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { baseQuery } from '../baseQuery';

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

type ProductListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type ProductListResponse = {
  success: boolean;
  message: string;
  data: {
    meta: ProductListMeta;
    result: Product[];
  };
};

type ProductDetailsResponse = {
  success: boolean;
  message: string;
  data: Product;
};

type FavoriteProduct = {
  id: string;
  product: Product;
};

type MyFavoriteProductsResponse = {
  success: boolean;
  message: string;
  data: FavoriteProduct[];
};

export type ProductListParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  myProducts?: boolean;
  isActive?: boolean;
};

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery,
  tagTypes: ['Product', 'ProductList', 'FavoriteProducts'],
  endpoints: (builder) => ({
    getMyProducts: builder.query<ProductListResponse, ProductListParams>({
      query: ({ page = 1, limit = 10, searchTerm, myProducts = true, isActive } = {}) => ({
        url: '/products',
        method: 'GET',
        params: {
          page,
          limit,
          searchTerm,
          myProducts,
          isActive,
        },
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to load products';
          toast.error(errorMessage);
        }
      },
      providesTags: (result) => {
        if (!result?.data?.result) {
          return [{ type: 'ProductList', id: 'MY' }];
        }

        return [
          { type: 'ProductList', id: 'MY' },
          ...result.data.result.map((product) => ({ type: 'Product' as const, id: product.id })),
        ];
      },
    }),

    getProductDetails: builder.query<ProductDetailsResponse, string>({
      query: (productId) => ({
        url: `/products/details/${productId}`,
        method: 'GET',
      }),
      async onQueryStarted(productId, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to load product details';
          toast.error(errorMessage);
        }
      },
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),

    createProduct: builder.mutation<ProductDetailsResponse, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Product created successfully');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to create product';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: [{ type: 'ProductList', id: 'MY' }],
    }),

    updateProduct: builder.mutation<ProductDetailsResponse, { productId: string; body: FormData }>({
      query: ({ productId, body }) => ({
        url: `/products/update/${productId}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Product updated successfully');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to update product';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: (result, error, args) => [
        { type: 'Product', id: args.productId },
        { type: 'ProductList', id: 'MY' },
      ],
    }),

    deleteProduct: builder.mutation<ProductDetailsResponse, string>({
      query: (productId) => ({
        url: `/products/delete/${productId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(productId, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Product deleted successfully');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to delete product';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
        { type: 'ProductList', id: 'MY' },
      ],
    }),

    toggleFavorite: builder.mutation<{ success: boolean; message: string }, string>({
      query: (productId) => ({
        url: `/products/favorite/${productId}`,
        method: 'PUT',
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to update favorite';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: [{ type: 'FavoriteProducts', id: 'LIST' }],
    }),

    getMyFavoriteProducts: builder.query<MyFavoriteProductsResponse, void>({
      query: () => ({
        url: '/products/my-favorite-products',
        method: 'GET',
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to load favorites';
          toast.error(errorMessage);
        }
      },
      providesTags: [{ type: 'FavoriteProducts', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMyProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleFavoriteMutation,
  useGetMyFavoriteProductsQuery,
} = productApi;

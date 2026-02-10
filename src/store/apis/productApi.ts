import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { baseQuery } from '../baseQuery';
import {
  ProductListResponse,
  ProductListParams,
  ProductDetailsResponse,
  MyFavoriteProductsResponse,
  CategoriesLockerResponse,
  CategoryListParams,
} from '@/types/product';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery,
  tagTypes: ['Product', 'ProductList', 'FavoriteProducts', 'Categories', 'LockerAddresses'],
  endpoints: (builder) => ({
    // get my products
    getMyProducts: builder.query<ProductListResponse, ProductListParams>({
      query: ({
        page = 1,
        limit = 10,
        searchTerm,
        myProducts = true,
        isActive,
        categorySlug,
      } = {}) => ({
        url: '/products',
        method: 'GET',
        params: {
          page,
          limit,
          searchTerm,
          myProducts,
          isActive,
          categorySlug,
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

    // get public products
    getProducts: builder.query<ProductListResponse, ProductListParams>({
      query: ({
        page = 1,
        limit = 10,
        searchTerm,
        myProducts = false,
        isActive,
        categorySlug,
      } = {}) => ({
        url: '/products',
        method: 'GET',
        params: {
          page,
          limit,
          searchTerm,
          myProducts,
          isActive,
          categorySlug,
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
          return [{ type: 'ProductList', id: 'PUBLIC' }];
        }

        return [
          { type: 'ProductList', id: 'PUBLIC' },
          ...result.data.result.map((product) => ({ type: 'Product' as const, id: product.id })),
        ];
      },
    }),

    // get product details
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

    // create product
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

    // update product
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

    // delete product
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

    // toggle favorite
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

    // get my favorite products
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

    // Get Categories
    getCategories: builder.query<CategoriesLockerResponse, CategoryListParams | void>({
      query: (params) => ({
        url: '/categories/all',
        method: 'GET',
        ...(params ? { params } : {}),
      }),
      providesTags: ['Categories'],
    }),

    getLockerAddresses: builder.query<CategoriesLockerResponse, void>({
      query: () => `/locker-address/all`,
      providesTags: ['LockerAddresses'],
    }),
  }),
});

export const {
  useGetMyProductsQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleFavoriteMutation,
  useGetMyFavoriteProductsQuery,
  useGetCategoriesQuery,
  useGetLockerAddressesQuery,
  useLazyGetCategoriesQuery,
  useLazyGetLockerAddressesQuery,
} = productApi;

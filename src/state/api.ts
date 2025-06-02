import {
  addAddressResponse,
  AddProductResponse,
  AuthSellerResponse,
  AuthUserResponse,
  ChangeStockResponse,
  getAddressResponse,
  getAllOrdersBySellerResponse,
  getProductByIdResponse,
  GetProductsResponse,
  getUserOrdersResponse,
  LoginSellerResponse,
  LoginUserResponse,
  placeOrderCODResponse,
  placeOrderStripeResponse,
  RegisterUserResponse,
} from "@/types/api";
import { Address, Order, Product, User } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get } from "http";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers, { endpoint }) => {
      const isSellerEndpoint = endpoint.toLowerCase().includes("seller");
      const token = isSellerEndpoint
        ? localStorage.getItem("seller_token")
        : localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Product", "Order", "Address"],
  endpoints: (build) => ({
    loginUser: build.mutation<LoginUserResponse, Partial<User>>({
      query: (user) => ({
        url: "api/user/login",
        method: "POST",
        body: user,
      }),
    }),
    loginSeller: build.mutation<LoginSellerResponse, Partial<User>>({
      query: (seller) => ({
        url: "api/seller/login",
        method: "POST",
        body: seller,
      }),
    }),
    registerUser: build.mutation<RegisterUserResponse, User>({
      query: (user) => ({
        url: "api/user/register",
        method: "POST",
        body: user,
      }),
    }),
    getAuthUser: build.query<AuthUserResponse, void>({
      query: () => "api/user/is-auth",
    }),
    getAuthSeller: build.query<AuthSellerResponse, void>({
      query: () => "api/seller/is-auth",
    }),

    // Products Endpoints
    getProducts: build.query<GetProductsResponse, void>({
      query: () => "api/product/list",
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    addProductBySeller: build.mutation<AddProductResponse, FormData>({
      query: (product) => ({
        url: "api/product/add",
        method: "POST",
        body: product,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    getProductById: build.query<getProductByIdResponse, string>({
      query: (id) => `api/product/${id}`,
    }),
    changeStockBySeller: build.mutation<ChangeStockResponse, string>({
      query: (id) => `api/product/stock/${id}`,
      invalidatesTags: (result) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id: result?.id },
      ],
    }),

    // Orders Endpoints
    getAllOrdersBySeller: build.query<getAllOrdersBySellerResponse, void>({
      query: () => "api/order/seller",
      providesTags: (result) =>
        result?.orders
          ? [
              ...result.orders.map(({ id }) => ({
                type: "Order" as const,
                id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    // Order Endpoints
    placeOrderCOD: build.mutation<placeOrderCODResponse, Partial<Order>>({
      query: (order) => ({
        url: "api/order/cod",
        method: "POST",
        body: order,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    placeOrderStripe: build.mutation<placeOrderStripeResponse, Partial<Order>>({
      query: (order) => ({
        url: "api/order/stripe",
        method: "POST",
        body: order,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    getUserOrders: build.query<getUserOrdersResponse, void>({
      query: () => "api/order/user",
      providesTags: (result) =>
        result?.orders
          ? [
              ...result.orders.map(({ id }) => ({
                type: "Order" as const,
                id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    // Address Endpoints
    addAddress: build.mutation<addAddressResponse, Partial<Address>>({
      query: (address) => ({
        url: "api/address/add",
        method: "POST",
        body: address,
      }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    getAddress: build.query<getAddressResponse, void>({
      query: () => "api/address/get",
      providesTags: (result) =>
        result?.addresses
          ? [
              ...result.addresses.map(({ id }) => ({
                type: "Address" as const,
                id,
              })),
              { type: "Address", id: "LIST" },
            ]
          : [{ type: "Address", id: "LIST" }],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetAuthUserQuery,
  useGetAuthSellerQuery,
  useGetProductsQuery,
  useAddProductBySellerMutation,
  useLoginSellerMutation,
  useChangeStockBySellerMutation,
  useGetAllOrdersBySellerQuery,
  useAddAddressMutation,
  useGetAddressQuery,
  usePlaceOrderCODMutation,
  usePlaceOrderStripeMutation,
  useGetUserOrdersQuery,
} = api;

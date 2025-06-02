import { Address, Order, Product, User } from "./prismaTypes";

export type AuthUserResponse = {
  success: boolean;
  user: Partial<User>;
  message?: string;
};

export type AuthSellerResponse = {
  success: boolean;
  message: string;
};

export type LoginUserResponse = {
  success: boolean;
  token: string;
  user: Partial<User>;
  message?: string;
};

export type LoginSellerResponse = {
  success: boolean;
  token?: string;
  message: string;
};

export type RegisterUserResponse = {
  success: boolean;
  token: string;
  user: Partial<User>;
  message?: string;
};

// api/product/list
export type GetProductsResponse = {
  success: boolean;
  products?: Product[];
  message?: string;
};

export type AddProductResponse = {
  success: boolean;
  message: string;
};

export type getProductByIdResponse = {
  success: boolean;
  product?: Product;
  message?: string;
};

export type ChangeStockResponse = {
  success: boolean;
  message: string;
  id?: string;
};

export type getAllOrdersBySellerResponse = {
  success: boolean;
  orders?: Order[];
  message?: string;
};

export type addAddressResponse = {
  success: boolean;
  message: string;
};

export type getAddressResponse = {
  success: boolean;
  addresses?: Address[];
  message?: string;
};

export type placeOrderCODResponse = {
  success: boolean;
  message: string;
};

export type placeOrderStripeResponse = {
  success: boolean;
  url?: string;
  message?: string;
};

export type getUserOrdersResponse = {
  success: boolean;
  orders?: Order[];
  message?: string;
};

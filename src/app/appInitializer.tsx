"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useGetAuthUserQuery,
  useGetProductsQuery,
  useGetAuthSellerQuery,
} from "@/state/api";
import { setUser, setIsSeller, setProducts } from "@/state";

const AppInitializer = () => {
  const dispatch = useDispatch();

  const { data: authUser, isSuccess: userSuccess } = useGetAuthUserQuery(
    undefined,
    {
      skip: typeof window === "undefined",
    }
  );

  const { data: authSeller, isSuccess: sellerSuccess } = useGetAuthSellerQuery(
    undefined,
    {
      skip: typeof window === "undefined",
    }
  );

  const { data: productData, isSuccess: productsSuccess } = useGetProductsQuery(
    undefined,
    {
      skip: typeof window === "undefined",
    }
  );

  useEffect(() => {
    if (userSuccess && authUser.success) {
      dispatch(setUser(authUser.user));
    }

    if (sellerSuccess && authSeller.success) {
      dispatch(setIsSeller(true));
    }

    if (productsSuccess && productData) {
      dispatch(setProducts(productData.products));
    }
  }, [
    authUser,
    authSeller,
    productData,
    userSuccess,
    sellerSuccess,
    productsSuccess,
    dispatch,
  ]);

  return null;
};

export default AppInitializer;

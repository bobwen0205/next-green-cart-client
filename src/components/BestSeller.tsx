"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "@/state/api";
import { log } from "console";

const BestSeller = () => {
  const { data: products, isSuccess } = useGetProductsQuery(undefined, {
    skip: typeof window === "undefined",
  });
  if (!isSuccess) return <>Loading...</>;
  if (!products || !products.products || products.products.length === 0) {
    return <p className="text-gray-500">No products available</p>;
  }

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {products.products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;

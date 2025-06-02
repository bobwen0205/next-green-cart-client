"use client";

import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import { addToCart, removeFromCart } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { Product } from "@/types/prismaTypes";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams();

  const products = useAppSelector((state) => state.global.products);
  const cartItems = useAppSelector((state) => state.global.cartItems);
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Get product directly based on ID
  const product = useMemo(() => {
    return products.find((item) => item.id === id);
  }, [products, id]);

  // Set related products when product or products change
  useEffect(() => {
    if (!product) return;

    const related = products
      .filter(
        (item) => item.id !== product.id && item.category === product.category
      )
      .slice(0, 5);

    setRelatedProducts(related);
  }, [product, products]);

  // Set thumbnail when product changes
  useEffect(() => {
    if (product) {
      setThumbnail(product?.images?.[0]);
    }
  }, [product]);

  if (!product || !thumbnail) {
    return <div>Loading...</div>;
  }

  return (
    product &&
    thumbnail && (
      <div className="mt-12">
        <p>
          <Link href={"/"}>Home</Link> /
          <Link href={"/products"}> Products</Link> /
          <Link href={`/products/${product.category.toLowerCase()}`}>
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-primary"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.images.map((image: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <Image
                src={thumbnail}
                alt="Selected product"
                width={500}
                height={500}
              />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium">{product.name}</h1>

            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <Image
                    key={i}
                    className="md:w-4 w-3.5"
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="star_icon"
                  />
                ))}
              <p className="text-base ml-2">(4)</p>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: {currency}
                {product.price}
              </p>
              <p className="text-2xl font-medium">
                MRP: {currency}
                {product.offerPrice}
              </p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc: string, index: number) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            <div className="flex items-center mt-10 gap-4 text-base">
              {/* <button
                onClick={() => addToCart(product.id)}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button> */}
              {!cartItems[product.id] ? (
                <button
                  onClick={() => dispatch(addToCart(product.id))}
                  className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded-lg"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center justify-between gap-2 w-full py-3.5 bg-primary/25 rounded select-none rounded-lg">
                  <button
                    onClick={() => dispatch(removeFromCart(product.id))}
                    className="cursor-pointer text-md px-4 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product.id]}
                  </span>
                  <button
                    onClick={() => dispatch(addToCart(product.id))}
                    className="cursor-pointer text-md px-4 h-full"
                  >
                    +
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  addToCart(product.id);
                  router.push("/cart");
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition rounded-lg"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        {/* Related Products */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-3xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
            {relatedProducts
              .filter((product) => product.inStock)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              router.push(`/products/${product.category.toLowerCase()}`);
              scrollTo(0, 0);
            }}
            className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10"
          >
            See more
          </button>
        </div>
      </div>
    )
  );
};

export default ProductDetails;

"use client";

import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useRouter } from "next/navigation";
import { Address, CartItem } from "@/types/prismaTypes";
import {
  useGetAddressQuery,
  usePlaceOrderCODMutation,
  usePlaceOrderStripeMutation,
} from "@/state/api";
import {
  setCartItems,
  setCount,
  toggleShowUserLogin,
  updateCartItem,
} from "@/state";
import Image from "next/image";

const Cart = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const products = useAppSelector((state) => state.global.products);
  const currency = useAppSelector((state) => state.global.currency);
  const cartItems = useAppSelector((state) => state.global.cartItems);
  const user = useAppSelector((state) => state.global.user);
  const cartCount = useAppSelector((state) => state.global.count);

  const [cartAmount, setCartAmount] = useState<number>(0);
  const [cartArray, setCartArray] = useState<CartItem[]>([]);
  const [showAddress, setShowAddress] = useState<Address>(null);
  //   const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address>(null);
  const [paymentOption, setPaymentOption] = useState<string>("COD");

  const { data: addresses, isSuccess } = useGetAddressQuery(undefined, {
    skip: !user,
  });

  const [placeOrderCOD] = usePlaceOrderCODMutation();
  const [placeOrderStripe] = usePlaceOrderStripeMutation();

  const getCart = () => {
    let tempArray = [] as CartItem[];
    for (const key in cartItems) {
      const product = products.find((product) => product.id === key);

      const productWithQuantity = {
        ...product,
        quantity: cartItems[key],
      };
      tempArray.push(productWithQuantity);
    }
    setCartArray(tempArray);
  };

  const getCartAmount = () => {
    const amount = Object.entries(cartItems).reduce(
      (total, [productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        if (product) {
          return total + product.offerPrice * quantity;
        }
        return total;
      },
      0
    );
    setCartAmount(amount);
  };

  const placeOrder = async () => {
    try {
      if (!user) {
        dispatch(toggleShowUserLogin());
        return;
      }

      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }
      // Place Order with COD
      if (paymentOption === "COD") {
        const data = await placeOrderCOD({
          items: cartArray.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          addressId: selectedAddress.id,
        }).unwrap();

        if (data.success) {
          toast.success(data.message);
          dispatch(setCartItems({}));
          dispatch(setCount(0));
          router.push("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        const data = await placeOrderStripe({
          items: cartArray.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          addressId: selectedAddress.id,
        }).unwrap();

        if (data.success) {
          window.location.replace(data.url!);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
      getCartAmount();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (isSuccess && addresses.addresses && addresses.addresses.length > 0) {
      setSelectedAddress(addresses.addresses[0]);
    }
  }, [addresses]);

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    products.length > 0 &&
    cartItems && (
      <div className="flex flex-col md:flex-row mt-16">
        <div className="flex-1 max-w-4xl">
          <h1 className="text-3xl font-medium mb-6">
            Shopping Cart{" "}
            <span className="text-sm text-primary">{cartCount} Items</span>
          </h1>

          <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
            <p className="text-left">Product Details</p>
            <p className="text-center">Subtotal</p>
            <p className="text-center">Action</p>
          </div>

          {cartArray.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
            >
              <div className="flex items-center md:gap-6 gap-3">
                <div
                  onClick={() => {
                    router.push(
                      `/products/${product.category.toLowerCase()}/${
                        product._id
                      }`
                    );
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                >
                  <Image
                    className="max-w-full h-full object-cover"
                    src={product.images[0]}
                    alt={product.name}
                    width={100}
                    height={100}
                  />
                </div>
                <div>
                  <p className="hidden md:block font-semibold">
                    {product.name}
                  </p>
                  <div className="font-normal text-gray-500/70">
                    <p>
                      Weight: <span>{product.weight || "N/A"}</span>
                    </p>
                    <div className="flex items-center">
                      <p>Qty:</p>
                      <select
                        onChange={(e) =>
                          dispatch(
                            updateCartItem({
                              id: product.id,
                              quantity: parseInt(e.target.value),
                            })
                          )
                        }
                        value={cartItems[product.id]}
                        className="outline-none"
                      >
                        {Array(
                          cartItems[product._id] > 9
                            ? cartItems[product._id]
                            : 9
                        )
                          .fill("")
                          .map((_, index) => (
                            <option key={index} value={index + 1}>
                              {index + 1}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center">
                {currency}
                {product.offerPrice * product.quantity}
              </p>
              <button
                onClick={() =>
                  dispatch(updateCartItem({ id: product.id, quantity: 0 }))
                }
                className="cursor-pointer mx-auto"
              >
                <Image
                  src={assets.remove_icon}
                  alt="remove_icon"
                  className="inline-block w-6 h-6"
                />
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              router.push("/products");
              scrollTo(0, 0);
            }}
            className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
          >
            <Image
              src={assets.arrow_right_icon_colored}
              alt="arrow_icon"
              className="group-hover:-translate-x-1 transition"
            />
            Continue Shopping
          </button>
        </div>

        <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
          <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
          <hr className="border-gray-300 my-5" />

          <div className="mb-6">
            <p className="text-sm font-medium uppercase">Delivery Address</p>
            <div className="relative flex justify-between items-start mt-2">
              <p className="text-gray-500">
                {selectedAddress
                  ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                  : "No address found"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-primary hover:underline cursor-pointer"
              >
                Change
              </button>
              {showAddress && (
                <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                  {addresses.addresses!.map((address, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddress(false);
                      }}
                      className="text-gray-500 p-2 hover:bg-gray-100"
                    >
                      {address.street}, {address.city}, {address.state},{" "}
                      {address.country}
                    </p>
                  ))}
                  <p
                    onClick={() => router.push("/add-address")}
                    className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                  >
                    Add address
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

            <select
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
            >
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          <hr className="border-gray-300" />

          <div className="text-gray-500 mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Price</span>
              <span>
                {currency}
                {cartAmount}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600">Free</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span>
                {currency}
                {(cartAmount * 2) / 100}
              </span>
            </p>
            <p className="flex justify-between text-lg font-medium mt-3">
              <span>Total Amount:</span>
              <span>
                {currency}
                {cartAmount + (cartAmount * 2) / 100}
              </span>
            </p>
          </div>

          <button
            onClick={placeOrder}
            className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition rounded-lg"
          >
            {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    )
  );
};

export default Cart;

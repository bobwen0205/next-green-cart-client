"use client";

import { assets } from "@/assets/assets";
import { setIsSeller } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import SellerLogin from "./login";

const SellerLayout = ({ children }: { children: React.ReactNode }) => {
  const isSeller = useAppSelector((state) => state.global.isSeller);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  if (!isSeller) {
    return <SellerLogin />;
  }

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = () => {
    localStorage.removeItem("seller_token");
    dispatch(setIsSeller(false));
    router.push("/");
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link href="/">
          <Image
            src={assets.logo}
            alt="logo"
            className="cursor-pointer w-3/4 md:w-38"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                href={item.path}
                key={item.name}
                className={`flex items-center py-3 px-4 gap-3 
              ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                  : "hover:bg-gray-100/90 border-white"
              }`}
              >
                <Image src={item.icon} alt="item_icon" className="w-7 h-7" />
                <p className="md:block hidden text-center">{item.name}</p>
              </Link>
            );
          })}
        </div>
        {children}
      </div>
    </>
  );
};

export default SellerLayout;

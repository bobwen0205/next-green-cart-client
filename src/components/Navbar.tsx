"use client";

import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { setSearchQuery, setUser, toggleShowUserLogin } from "@/state";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((state) => state.global.user);
  const searchQuery = useAppSelector((state) => state.global.searchQuery);
  const cartCount = useAppSelector((state) => state.global.count);

  const logout = async () => {
    dispatch(setUser(null));
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      router.push("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <Link href="/" onClick={() => setOpen(false)}>
        <Image className="h-9" src={assets.logo} alt="logo" />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <Link href="/">Home</Link>
        <Link href="/products">All Product</Link>
        <Link href="/">Contact</Link>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <Image
            src={assets.search_icon}
            alt="search_icon"
            className="w-4 h-4"
          />
        </div>

        <div
          onClick={() => router.push("/cart")}
          className="relative cursor-pointer"
        >
          <Image
            src={assets.cart_icon}
            alt="cart_icon"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {cartCount}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => dispatch(toggleShowUserLogin())}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <Image
              src={assets.profile_icon}
              alt="profile_icon"
              className="w-10"
            />
            <ul
              className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30
             rounded-md text-sm z-40"
            >
              <li
                onClick={() => router.push("my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => router.push("/cart")}
          className="relative cursor-pointer"
        >
          <Image
            src={assets.cart_icon}
            alt="cart_icon"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {cartCount}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
        >
          {/* Menu Icon SVG */}
          <Image src={assets.menu_icon} alt="menu_icon" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
        >
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/products" onClick={() => setOpen(false)}>
            All Product
          </Link>
          {user && (
            <Link href="/orders" onClick={() => setOpen(false)}>
              My Orders
            </Link>
          )}
          <Link href="/" onClick={() => setOpen(false)}>
            Contact
          </Link>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                dispatch(toggleShowUserLogin());
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

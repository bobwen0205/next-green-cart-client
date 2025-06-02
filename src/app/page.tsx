"use client";

import BestSeller from "@/components/BestSeller";
import BottomBanner from "@/components/BottomBanner";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import Login from "@/components/Login";
import MainBanner from "@/components/MainBanner";
import Navbar from "@/components/Navbar";
import NewsLetter from "@/components/NewsLetter";
import { useAppSelector } from "@/state/redux";
import { usePathname } from "next/navigation";
import React from "react";

const Home = () => {
  return (
    <>
      <div className="mt-10">
        <MainBanner />
        <Categories />
        <BestSeller />
        <BottomBanner />
        <NewsLetter />
      </div>
    </>
  );
};

export default Home;

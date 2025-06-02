import Footer from "@/components/Footer";
import Login from "@/components/Login";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/state/redux";
import { usePathname } from "next/navigation";
import React from "react";

const InnerProviders = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isSellerPath = pathname.startsWith("/seller");

  const showUserLogin = useAppSelector((state) => state.global.showUserLogin);
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <div className={`${!isSellerPath && "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        {children}
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default InnerProviders;

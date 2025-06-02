"use client";

import Footer from "@/components/Footer";
import Login from "@/components/Login";
import Navbar from "@/components/Navbar";
import StoreProvider, { useAppSelector } from "@/state/redux";
import { usePathname } from "next/navigation";
import InnerProviders from "./innerProviders";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <InnerProviders>{children}</InnerProviders>
    </StoreProvider>
  );
};

export default Providers;

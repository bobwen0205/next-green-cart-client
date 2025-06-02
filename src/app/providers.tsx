"use client";

import StoreProvider, { useAppSelector } from "@/state/redux";
import InnerProviders from "./innerProviders";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <InnerProviders>{children}</InnerProviders>
    </StoreProvider>
  );
};

export default Providers;

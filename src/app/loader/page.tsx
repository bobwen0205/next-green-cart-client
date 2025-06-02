"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import Loading from "./loading";

const Loader = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (nextUrl) {
      timeoutId = setTimeout(() => {
        router.push(`${nextUrl}`);
      }, 5000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [nextUrl, router]);
  return (
    <Suspense>
      <Loading />
    </Suspense>
  );
};

export default Loader;

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Loading = () => {
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
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
    </div>
  );
};

export default Loading;

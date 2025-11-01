// Example: /pages/AuthCallback.js
"use client"
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserProfile } from "@/services/userAPI";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to read query params

  useEffect(() => {
    // 1. Read the access token from the URL
    const token = searchParams.get("token");

    if (token) {
      // 2. Save it to localStorage
      const handleToken = async () => {
        try {
          // 2. Save it to localStorage
          localStorage.setItem("token", token); // Key changed from "authToken"
          const getUserData = await getUserProfile();
          localStorage.setItem("user", JSON.stringify(getUserData.data));
          // console.log(getUserData); // You can use this data
          // ---

          // 3. Redirect to the main app
          router.push("/home");
        } catch (error) {
          console.error("Failed to process auth token:", error);
          router.push("/login?error=auth-processing-failed");
        }
      };

      handleToken();
    } else {
      router.push("/login?error=token-missing");
    }
  }, [router, searchParams]); // Add dependencies

  return <div>Loading, please wait...</div>;
}

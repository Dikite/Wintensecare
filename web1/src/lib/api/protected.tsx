"use client";
 
import { useEffect, useState } from "react";
import { useRouter } from "@/navigation";
import { api } from "./api";
import { clearToken, getToken } from "./auth";
 
export default function Protected({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
 
  useEffect(() => {
    const token = getToken();
 
    // 🔐 No token → login immediately
    if (!token) {
      router.replace("/login");
      return;
    }
 
    // 🔐 Validate session
    api("/users/me")
      .then(() => {
        setChecking(false); // ✅ session valid
      })
      .catch(() => {
        clearToken();
        router.replace("/login");
      });
  }, [router]);
 
  // ⏳ Prevent rendering until auth is verified
  if (checking) {
    return null; // or spinner
  }
 
  return <>{children}</>;
}
 
 
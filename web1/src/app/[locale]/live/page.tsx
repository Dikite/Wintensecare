"use client";
 
import Protected from "@/lib/api/protected";
import LiveMonitor from "./livemonitor";
import { useEffect, useState } from "react";
import { useRouter } from "@/navigation";
 
export default function Page() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const router = useRouter();
 
  useEffect(() => {
    const id = localStorage.getItem("deviceId");
 
    if (!id) {
      router.push("/login"); // or device selection page
      return;
    }
 
    setDeviceId(id);
  }, [router]);
 
  return (
    <Protected>
      {deviceId ? <LiveMonitor deviceId={deviceId} /> : null}
    </Protected>
  );
}
 
 
 
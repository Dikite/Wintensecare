"use client";
 
import Protected from "@/lib/api/protected";
import { useTranslations } from "next-intl";
 
export default function DeviceTelemetry() {
  const t = useTranslations("telemetry");
 
  return (
    <Protected>
      <h2>{t("comingSoon")}</h2>
    </Protected>
  );
}
 
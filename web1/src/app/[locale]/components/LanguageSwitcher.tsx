"use client";

import { useRouter, usePathname } from "@/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function changeLang(locale: string) {
    router.replace(pathname, { locale });
  }

  return (
    <select onChange={(e) => changeLang(e.target.value)}>
      <option value="en">English</option>
      <option value="ta">தமிழ்</option>
      <option value="hi">हिंदी</option>
      <option value="te">తెలుగు</option>
      <option value="kn">ಕನ್ನಡ</option>
      <option value="ml">മലയാളം</option>
    </select>
  );
}
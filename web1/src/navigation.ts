import {createNavigation} from "next-intl/navigation";

export const {Link, redirect, useRouter, usePathname} = createNavigation({
  locales: ["en", "ta", "hi", "te", "kn", "ml"],
  defaultLocale: "en",
  localePrefix: "as-needed"
});
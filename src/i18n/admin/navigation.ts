import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// 로케일이 자동으로 prefix되는 Link, redirect, usePathname, useRouter, getPathname
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

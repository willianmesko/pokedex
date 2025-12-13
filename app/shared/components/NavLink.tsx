"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef, useTransition } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface NavLinkProps extends Omit<LinkProps, "className"> {
  className?:
    | string
    | ((props: { isActive: boolean; isPending: boolean }) => string);
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, ...props }, ref) => {
    const pathname = usePathname();
    const [isPending] = useTransition();

    const isActive =
      typeof href === "string" ? pathname === href : pathname === href.pathname;

    const resolvedClassName =
      typeof className === "function"
        ? className({ isActive, isPending })
        : className;

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(resolvedClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };

"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Url } from "next/dist/shared/lib/router/router";

const navItems = [
  {
    id: "main",
    label: "Tracking and Messaging",
    href: "/main",
  },
  {
    id: "about",
    label: "About",
    href: "/about",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
  },
];

const Navbar = (props) => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <nav className="pb-4 md:pb-8 flex justify-between items-center">
      <Link
        href="/"
        className="text-lg md:text-3xl font-bold text-spotify-green"
      >
        webapp
      </Link>
     <ul className="flex justify-end items-center gap-4">
        {navItems.map((eachItem) => (
          <li key={eachItem.id}>
            <Link
              href={eachItem.href}
              className={`${
                isActive(eachItem.href) ? "text-spotify-green" : ""
              }`}
            >
              {eachItem.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
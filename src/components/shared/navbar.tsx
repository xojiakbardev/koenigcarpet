"use client";

import { useEffect, useState } from "react";
import { Menu, Search, User2 } from "lucide-react";
import clsx from "clsx";
import useDrawerStore from "@/hooks/useDrawerStore";
import CartButton from "./cartButton";
import { useLocale } from "@/hooks/useLocale";
import Link from "next/link";
import { useDictionary } from "@/hooks/useDictionary";
import Image from "next/image";

interface NavbarProps {
  fixed?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ fixed = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useDrawerStore()
  const [locale] = useLocale();
  const { dictionary } = useDictionary();

  useEffect(() => {
    if (fixed) return;

    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fixed]);

  return (


    <header className={fixed ? "fixed top-0 w-full z-30" : ""}>
      <div className="w-full bg-black  py-2">
        <div className="flex text-white justify-center items-center gap-5 text-xs font-light tracking-wider">
          <span>{dictionary?.header["custom-size"]}</span>
          <span>|</span>
          <span>{dictionary?.header["custom-color"]}</span>
          <span>|</span>
          <span>{dictionary?.header["custom-design"]}</span>
        </div>
      </div>

      <nav className="text-white w-full z-50 transition-all duration-500">

        <div className="mx-auto px-4 md:px-10 flex items-center justify-between h-16">


          <div className="flex items-center gap-4 text-2xl font-bold cursor-pointer">
            <button className="cursor-pointer p-2 rounded-full transition"
              onClick={() => open("sidebar")}>
              <Menu className="w-6 h-6" />
            </button>

            <Link href={`/${locale}`}>
              <Image
                src="/logo-light.png"
                alt="Logo"
                width={850}
                height={430}
                priority
                className="w-30 object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="cursor-pointer p-2 rounded-full transition"
            onClick={()=>open("searchComp")}>
              <Search className="size-4 md:size-6" />
            </button>
            <button className="cursor-pointer p-2 rounded-full transition">
              <User2 className="size-4 md:size-6" />
            </button>
            <Link href={`/${locale}/cart`}>
              <CartButton />
            </Link>
          </div>
        </div>
      </nav>

      <nav className={clsx("shadow w-full z-50 transition-all duration-500 fixed -top-full bg-white text-black",
        scrolled && "top-0"
      )}>

        <div className="mx-auto px-4 md:px-10 flex items-center justify-between h-16">


          <div className="flex items-center gap-4 text-2xl font-bold cursor-pointer">
            <button className="cursor-pointer p-2 rounded-full transition"
              onClick={() => open("sidebar")}>
              <Menu className="w-6 h-6" />
            </button>

            <Link href={`/${locale}`}>
              <Image
                src="/logo-dark.png"
                alt="Logo"
                width={850}
                height={430}
                priority
                className="w-30 object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="cursor-pointer p-2 rounded-full transition">
              <Search className="w-6 h-6" />
            </button>
            <button className="cursor-pointer p-2 rounded-full transition">
              <User2 className="w-6 h-6" />
            </button>
            <Link href={`/${locale}/cart`}>

              <CartButton />
            </Link>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

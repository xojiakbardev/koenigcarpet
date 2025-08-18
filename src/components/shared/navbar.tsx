"use client";

import { useEffect, useState } from "react";
import { Menu, Search, Heart } from "lucide-react";
import clsx from "clsx";
import useDrawerStore from "@/hooks/useDrawerStore";
import CartButton from "./cartButton";
import { useLocale } from "@/hooks/useLocale";
import Link from "next/link";

interface NavbarProps {
  fixed?: boolean; 
}

const Navbar: React.FC<NavbarProps> = ({fixed = false}) => {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useDrawerStore()
  const [locale] = useLocale();

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
          <span>CUSTOM SIZE</span>
           <span>|</span>
          <span>CUSTOM COLOR</span>
           <span>|</span>
          <span>CUSTOM DESIGN</span>
      </div>
    </div>
    
    <nav className="text-white w-full z-50 transition-all duration-500">
      
      <div className="mx-auto px-4 md:px-10 flex items-center justify-between h-16">
        

        <div className="flex items-center gap-4 text-2xl font-bold cursor-pointer">
          <button className="cursor-pointer p-2 rounded-full transition"
          onClick={() => open("sidebar")}>
          <Menu className="w-6 h-6" />
        </button>

        <Link href={`/${locale}`}>LOGO</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="cursor-pointer p-2 rounded-full transition">
            <Search className="w-6 h-6" />
          </button>
          <button className="cursor-pointer p-2 rounded-full transition">
            <Heart className="w-6 h-6" />
          </button>
          <CartButton/>
        </div>
      </div>
    </nav>

    <nav className={clsx("w-full z-50 transition-all duration-500 fixed -top-full bg-white text-black",
      scrolled && "top-0"
    )}>
      
      <div className="mx-auto px-4 md:px-10 flex items-center justify-between h-16">
        

        <div className="flex items-center gap-4 text-2xl font-bold cursor-pointer">
          <button className="cursor-pointer p-2 rounded-full transition"
          onClick={() => open("sidebar")}>
          <Menu className="w-6 h-6" />
        </button>

        <h1>LOGO</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="cursor-pointer p-2 rounded-full transition">
            <Search className="w-6 h-6" />
          </button>
          <button className="cursor-pointer p-2 rounded-full transition">
            <Heart className="w-6 h-6" />
          </button>
          <CartButton/>
        </div>
      </div>
    </nav>
</header>
  );
};

export default Navbar;

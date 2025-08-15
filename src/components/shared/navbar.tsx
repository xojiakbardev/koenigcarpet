"use client";

import { useEffect, useState } from "react";
import { Menu, Search, Heart, ShoppingCart } from "lucide-react";
import clsx from "clsx";

interface NavbarProps {
  fixed?: boolean; 
  cartCount?: number; 
  bgColor?: string; 
  hasOption?: boolean
}

const Navbar: React.FC<NavbarProps> = ({
  fixed = false,
  cartCount = 0,
  bgColor = "bg-white",
  hasOption = false
}) => {
  const [scrolled, setScrolled] = useState(false);

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
    
    <nav
      className={clsx(
        "w-full z-50 transition-all duration-500",
        fixed
          ? "fixed top-0 bg-transparent"
          : scrolled
          ? `fixed top-0 ${bgColor} shadow-md`
          : "absolute top-0 bg-transparent"
      )}
    >
          <div className="top-0 w-full bg-black text-white py-2">
      <div className="flex justify-center items-center gap-5 text-sm font-medium tracking-wider">
          <span className="text-white">CUSTOM SIZE</span>
           <span className="text-white">|</span>
          <span className="text-white">CUSTOM COLOR</span>
           <span className="text-white">|</span>
          <span className="text-white">CUSTOM DESIGN</span>
      </div>
    </div>
      
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        

        <div className="flex items-center gap-4 text-2xl font-bold cursor-pointer">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <Menu className="w-6 h-6" />
        </button>

        <h1>LOGO</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Search className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Heart className="w-6 h-6" />
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

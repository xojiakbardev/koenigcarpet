"use client";

import { Facebook, Instagram, LinkedinIcon, Phone } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white w-full h-full py-12 flex flex-col items-center justify-center gap-10">
      
      <div className="flex flex-col items-center mb-8">
        <input
          type="email"
          placeholder="Enter your e-mail..."
          className="border-b border-black text-black placeholder:text-black placeholder:uppercase focus:outline-none text-center mb-4 w-72 md:w-96 p-4"
        />
        <button className="border text-black border-black px-20 py-4 hover:bg-black hover:text-white transition">
          Send
        </button>
      </div>

      <div className="flex gap-6 mb-8">
        <Facebook className="text-black cursor-pointer" />
        <Instagram className="text-black cursor-pointer" />
        <LinkedinIcon className="text-black cursor-pointer" />
        <Phone className="text-black cursor-pointer" />
      </div>



      <div className="flex flex-col md:flex-row gap-12 text-center md:text-left">
        <div className="flex flex-col items-center">
          <h3 className="text-md text-black underline font-semibold mb-2 flex justify-center md:justify-start items-center gap-2">
            POLICIES 
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li>Sales</li>
            <li>Privacy</li>
            <li>Delivery and Return</li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-md text-black underline font-semibold mb-2 flex justify-center md:justify-start items-center gap-2">
            COMPANY 
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li>Blog</li>
            <li>Contact</li>
            <li>About Us</li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col items-center">
          <h3 className="text-md text-black underline font-semibold mb-2 flex justify-center md:justify-start items-center gap-2">
            SUPPORT 
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li>FAQ</li>
            <li>WhatsApp Line</li>
          </ul>
        </div>
      </div>

            <div className="text-center text-gray-400 text-xs mb-4">
        © 2023 BM HOME All rights reserved. &nbsp;
        Gizlilik Politikası ve Çerezler | Satış Genel Şartları
      </div>
    </footer>
  );
};

export default Footer;

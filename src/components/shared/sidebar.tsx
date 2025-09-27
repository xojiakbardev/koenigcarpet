"use client";

import { useState } from "react";
import useDrawerStore from "@/hooks/useDrawerStore";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDictionary } from "@/hooks/useDictionary";

type SidebarProps = {
  locale: string;
};

export default function Sidebar({ locale }: SidebarProps) {
  const { sidebar, close } = useDrawerStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { dictionary } = useDictionary()

  const toggleSection = (title: string) => {
    setExpandedSection(prev => (prev === title ? null : title));
  };


  return (
    <div>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${sidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => close("sidebar")}
      />

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-xl z-50 transform transition-transform duration-300 ${sidebar ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="overflow-y-auto h-full">
          <div className="w-full mb-4 border-b  sticky top-0 border-gray-400 bg-white">
            <Link href={`/${locale}`}>
              <Image
                src="/logo-dark.png"
                alt="Logo"
                width={800}
                height={400}
                priority
                className="w-34 object-contain"
              />
            </Link>

            <button onClick={() => close("sidebar")} className="absolute top-2 right-2 cursor-pointer">
              <X className="size-6" />
            </button>
          </div>


          {dictionary?.shared.sideBarLinks.map(item => {
            const isExpanded = expandedSection === item.title;

            return (
              <div key={item.title}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSection(item.title)}
                      className="flex justify-between items-center w-full p-2 hover:bg-gray-100 rounded transition-colors duration-200 capitalize cursor-pointer"
                    >
                      {item.title}
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? "mt-1 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      {item.children.map(child => {
                        const childPath = `${item.path}/${child.value}`;
                        return (
                          <Link
                            key={child.title}
                            href={`/${locale}${childPath}`}
                            className="block text-sm pl-4 p-1 hover:bg-gray-100 rounded transition-colors duration-200 capitalize cursor-pointer"
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <Link
                    href={`/${locale}${item.path}`}
                    className="flex capitalize p-2 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

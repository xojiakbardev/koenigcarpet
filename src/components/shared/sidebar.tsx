"use client";

import { useState } from "react";
import useDrawerStore from "@/hooks/useDrawerStore";
import { SIDEBAR_LINKS } from "@/lib/const";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

type SidebarProps = {
  locale: string;
};

type ExpandedState = {
  [key: string]: boolean;
};

export default function Sidebar({ locale }: SidebarProps) {
  const { sidebar, close } = useDrawerStore();
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
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

        <div className="p-5 overflow-y-auto h-full">
          <div className="w-full mb-4 border-b py-2">
            <Link href={`/${locale}`} className="text-2xl font-bold uppercase">Logo</Link>
          </div>
          {SIDEBAR_LINKS.map((item) => (
            <div key={item.title} className="mb-2">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className="capitalize flex justify-between items-center w-full font-semibold cursor-pointer p-2 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    {item.title}
                    {expanded[item.title] ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${expanded[item.title] ? "max-h-96 mt-1" : "max-h-0"
                      }`}
                  >
                    {item.children.map((child) => {
                      const childPath = `/${item.title.replace(/\s+/g, "-").toLowerCase()}/${child.title
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`;
                      return (
                        <a
                          key={child.title}
                          href={`/${locale}${childPath}`}
                          className="block pl-6 py-1 hover:bg-gray-100 rounded transition-colors duration-200 capitalize"
                        >
                          {child.title}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <a
                  href={`/${locale}${item.path}`}
                  className="flex capitalize font-semibold p-2 hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer"
                >
                  {item.title}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

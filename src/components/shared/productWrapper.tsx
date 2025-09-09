"use client";

import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  searchParams: Record<string, string | string[]>;
};

const ProductWrapper: FC<Props> = ({ children, className, searchParams }) => {
  const grid = searchParams.grid;

  const validatedGrid = ["2", "3", "4", "5", "6"].includes(String(grid))
    ? String(grid)
    : "4";

  return (
    <div
      data-grid={validatedGrid}
      className={`
        grid gap-3 bg-white transition-all duration-300
        ${className || ''}

        /* ✅ Asosiy grid — searchParams.grid bo‘yicha */
        data-[grid="2"]:md:grid-cols-2
        data-[grid="3"]:md:grid-cols-3
        data-[grid="4"]:md:grid-cols-4
        data-[grid="5"]:md:grid-cols-5
        data-[grid="6"]:md:grid-cols-6

        grid-cols-2

        md:px-10

      `}
    >
      {children}
    </div>
  );
};

export default ProductWrapper;

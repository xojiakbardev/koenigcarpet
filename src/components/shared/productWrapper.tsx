"use client";

import { useQueryState } from "@/hooks/useQueryState";
import { FC, ReactNode } from "react";

type Props = { children: ReactNode };


const ProductWrapper: FC<Props> = ({ children }) => {
    const [grid] = useQueryState("grid", false)
  return (
    <div
      data-grid={grid}
      className="grid gap-4 p-10 bg-white grid-cols-3
      data-[grid=3]:grid-cols-3
      data-[grid=4]:grid-cols-4
      data-[grid=6]:grid-cols-6"
    >
      {children}
    </div>
  );
};

export default ProductWrapper;

"use client"

import { useQueryState } from "@/hooks/useQueryState"
import { RugProduct } from "@/types/product"
import Image from "next/image"
import { FC } from "react"

type Props = {
    rug: RugProduct
}

const RugColors: FC<Props> = ({ rug }) => {
    const [queryColor, setQueryColor] = useQueryState("color", false)


    return (
        <div className="flex flex-col">
            <h2 className="mb-2">Colors</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-4">
                {rug.colors.map((color, i) => (
                    <figure
                        key={i}
                        data-selected={queryColor === color.name}
                        className="p-1 border cursor-pointer
                        data-[selected='true']:ring-2 data-[selected='true']:ring-offset-2">
                        <Image
                            src={color.images[0]}
                            alt={color.name}
                            width={270}
                            height={380}
                            priority
                            className="w-full object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            onClick={() => {
                                setQueryColor(color.name)
                            }}
                        />
                    </figure>
                ))}
            </div>

            {queryColor && (
                <div className="flex items-center justify-between flex-wrap mt-4 p-2 border bg-gray-50">
                    <p className="font-medium text-gray-800">Selected Color: {queryColor}</p>
                </div>
            )}
        </div>
    )
}

export default RugColors

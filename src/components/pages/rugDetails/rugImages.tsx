"use client"

import { useQueryState } from "@/hooks/useQueryState"
import { RugProduct } from "@/types/product"
import Image from "next/image"
import { FC } from "react"

type Props = {
    rug: RugProduct
}

const RugImages: FC<Props> = ({ rug }) => {
    const [color] = useQueryState("color", false)

    let selectedColor = rug.colors.find(c => c.name === color)

    if (!selectedColor) {
        selectedColor = rug.colors[0]
    }

    return (
        <div className="flex flex-col">
            {selectedColor.images.map((image, index) => (
                <figure key={index} className="w-full">
                    <Image
                        key={index}
                        src={image}
                        alt={`${rug.name} - ${selectedColor.name}`}
                        width={270}
                        height={387}
                        priority
                        className="w-full object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                </figure>
            ))}
        </div>
    )
}

export default RugImages

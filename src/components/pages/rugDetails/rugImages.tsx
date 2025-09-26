"use client"

import { Locale } from "@/localization/config"
import { RugProduct } from "@/types/product"
import Image from "next/image"
import { FC } from "react"

type Props = {
    rug: RugProduct
    locale:Locale, 
    relatedProducts:RugProduct[]
}

const RugImages: FC<Props> = ({ rug }) => {



    return (
        <div className="flex flex-col">
            {rug.images.map((image, index) => (
                <figure key={index} className="w-full">
                    <Image
                        key={index}
                        src={image}
                        alt={`${String(rug.id)}`}
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

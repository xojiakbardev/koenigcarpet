"use client";

import { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";


import {
    ShoppingBag,
    User,
    CreditCard,
    FileText,
    Truck,
    RotateCcw,
    Package,
    Brush,
    ShieldCheck,
    FileSignature,
} from "lucide-react";

type FaqItem = {
    title: string;
    icon: LucideIcon;
    sections: {
        title?: string;
        texts: string[];
    }[];
};

const faqData: FaqItem[] = [
    {
        title: "shopping",
        icon: ShoppingBag,
        sections: [
            {
                title: "WEB SITE",
                texts: [
                    "You can shop at BM Home as a guest user or a registered customer.",
                    "Signing up is very easy. Your information will be saved for your future purchases.",
                    "If you shop as a guest user, details of your order will be sent via confirmation email.",
                ],
            },
            {
                title: "SHOWROOM",
                texts: [
                    "You can thoroughly examine and purchase our products at our showroom located within our factory.",
                    "In order to better serve our customers, we conduct showroom visits through an appointment system.",
                    "Through our Whatsapp line you can schedule an appointment.",
                ],
            },
        ],
    },
    {
        title: "account",
        icon: User,
        sections: [
            {
                title: "YOUR BM HOME ACCOUNT",
                texts: ["You can easily sign up and save your information for future purchases."],
            },
            {
                title: "FAVORITES",
                texts: [
                    "You can save your favorite products by clicking the heart icon located on them.",
                    "To use this option, you need to be a registered customer.",
                ],
            },
        ],
    },
    {
        title: "payment",
        icon: CreditCard,
        sections: [
            {
                title: "PAYMENT OPTIONS",
                texts: ["You can make payment via bank transfer or credit card."],
            },
        ],
    },
    {
        title: "invoice",
        icon: FileText,
        sections: [
            {
                title: "INVOICE",
                texts: [
                    "You can request an individual or corporate invoice for your order.",
                    "We send your invoice along with your order.",
                ],
            },
            {
                title: "LOST INVOICE",
                texts: [
                    "Through our Whatsapp line you can contact us to request the PDF file of your invoice.",
                ],
            },
        ],
    },
    {
        title: "delivery",
        icon: Truck,
        sections: [
            {
                title: "DELIVERY",
                texts: [
                    "The shipping cost is to be borne by the customer.",
                    "We produce and ship our products within 14–21 business days.",
                ],
            },
            {
                title: "MISSING / DAMAGED DELIVERY",
                texts: [
                    "You should open your package in front of the courier and check your order.",
                    "If you detect missing or damaged products, ask the courier for a report form and fill it in.",
                    "Contact us via our support line.",
                ],
            },
        ],
    },
    {
        title: "return",
        icon: RotateCcw,
        sections: [
            {
                title: "STANDARD PRODUCTS",
                texts: [
                    "You can return unused products within 14 days, in original packaging, via our agreement code with Yurtiçi Kargo.",
                    "Return shipping cost belongs to the customer.",
                    "If the product is damaged due to poor packaging, responsibility belongs to the customer.",
                ],
            },
            {
                title: "CUSTOM PRODUCTS",
                texts: [
                    "We do not accept returns of custom size, color, or patterned products.",
                ],
            },
            {
                title: "REFUND",
                texts: [
                    "Refund is processed via the original payment method.",
                    "A refund confirmation email will be sent when completed.",
                    "If after 14 days you do not see the refund, please contact your bank.",
                ],
            },
        ],
    },
    {
        title: "product usage",
        icon: Package,
        sections: [
            {
                title: "PRODUCT TYPES",
                texts: [
                    "Our rugs vary in weaving techniques, patterns, color count, weight, and design differences.",
                    "Therefore, pricing differs by product category.",
                ],
            },
            {
                title: "MEASUREMENT DEVIATIONS",
                texts: [
                    "Rugs shrink after dyeing and/or washing.",
                    "Shrinkage rate can vary by batch.",
                    "Deviations of +/- 3% in measurements are considered normal.",
                ],
            },
            {
                title: "EDGE RIPPLING",
                texts: [
                    "Due to dyeing/washing, rippling may occur along the edges.",
                    "To minimize rippling, press along the edges with a cylindrical object.",
                ],
            },
            {
                title: "SLIPPAGE",
                texts: [
                    "To prevent rug slippage, use anti-slip adhesive tape or a non-slip mat.",
                ],
            },
            {
                title: "GUARANTEE",
                texts: [
                    "Our rugs are guaranteed for 1 year against manufacturing defects.",
                    "If you encounter issues, contact our support line with photos and a written description.",
                    "Depending on the situation, we may replace or refund the product.",
                ],
            },
        ],
    },
    {
        title: "custom production",
        icon: Brush,
        sections: [
            {
                title: "CUSTOM SIZE",
                texts: [
                    "We can produce rugs up to 240cm width and 1500cm length.",
                    "Pricing differences apply for custom size productions.",
                ],
            },
            {
                title: "SPECIAL COLOR VARIANT",
                texts: [
                    "We can produce custom orders based on colors you choose from our options without extra charge.",
                ],
            },
            {
                title: "SPECIAL PATTERN DESIGN",
                texts: [
                    "We can create custom designs according to your preferences.",
                    "Pricing is based on quantity for custom designs.",
                ],
            },
        ],
    },
    {
        title: "privacy",
        icon: ShieldCheck,
        sections: [
            {
                title: "PRIVACY POLICY",
                texts: [
                    "BM Home protects customer personal data shared on the website.",
                    "Confidential information will not be shared with third parties without permission.",
                    "Both parties are obligated to keep commercial and technical information confidential.",
                    "Confidentiality begins with the purchase and continues after sales.",
                ],
            },
        ],
    },
    {
        title: "sales",
        icon: FileSignature,
        sections: [
            {
                title: "SALES AGREEMENT",
                texts: [
                    "This agreement regulates conditions of shopping on bmhome.com.tr.",
                    "The customer agrees to follow all terms of the contract and usage policies.",
                    "BM Home reserves the right to modify service details.",
                    "Disputes will be handled by Istanbul courts.",
                ],
            },
        ],
    },
];



const FaqAccordion = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    return (
        <div className="px-6 md:px-24 py-12 bg-white text-gray-900">
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
                {faqData.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={index}>
                            {/* Header */}
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between py-4 focus:outline-none cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className="size-5 md:size-8 text-black" />
                                    <span className="font-semibold uppercase">{item.title}</span>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Content with filterDrawer-like effect */}
                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="pb-6 pl-8 space-y-6">
                                    {item.sections.map((sec, i) => (
                                        <div key={i} className="space-y-2">
                                            {sec.title && (
                                                <h3 className="text-sm font-semibold" >{sec.title}</h3>
                                            )}
                                            <ul className="space-y-1">
                                                {sec.texts.map((txt, j) => (
                                                    <li
                                                        key={j}
                                                        className="text-sm text-gray-700 leading-relaxed"
                                                    >
                                                        {txt}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FaqAccordion;

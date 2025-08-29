"use client";

import { useDictionary } from "@/hooks/useDictionary";
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";

const Footer = () => {
  const { dictionary } = useDictionary();

  const iconMap: Record<string, React.ElementType> = {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Linkedin,
    MessageCircle,
    Share2,
  };
  return (
    <footer className="bg-white w-full h-full py-12 flex flex-col items-center justify-center gap-10">

      <div className="flex flex-col items-center mb-8">
        <input
          type="email"
          placeholder={dictionary?.footer.placeholder}
          className="border-b border-black text-black placeholder:text-black placeholder:uppercase focus:outline-none text-center mb-4 w-72 md:w-96 p-4"
        />
        <button className="border text-black border-black px-20 py-4 hover:bg-black hover:text-white transition">
          {dictionary?.footer.send}
        </button>
      </div>

      <div className="flex gap-6 mb-8">
        {dictionary?.contacts.social.value.map((social: any, i: number) => {
          const SocialIcon = iconMap[social.platform] || Share2;
          return (
            <a
              key={i}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
            >
              <SocialIcon className="w-5 h-5" />
            </a>
          );
        })}
      </div>



      <div className="flex flex-col md:flex-row gap-12 text-center md:text-left">
        <div className="flex flex-col items-center">
          <h3 className="text-md text-black underline font-semibold mb-2 flex justify-center md:justify-start items-center gap-2">
            {dictionary?.footer.policies}
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li>{dictionary?.footer.sales}</li>
            <li>{dictionary?.footer.privacy}</li>
            <li>{dictionary?.footer["delivery-return"]}</li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-md text-black underline font-semibold mb-2 flex justify-center md:justify-start items-center gap-2">
            {dictionary?.footer.company}
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li>{dictionary?.footer.faq}</li>
            <li>{dictionary?.footer.contact}</li>
            <li>{dictionary?.footer["about-us"]}</li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col items-center">
          <h3 className="text-md text-black underline font-semibold mb-2 flex justify-center md:justify-start items-center gap-2">
            {dictionary?.footer.support}
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li>{dictionary?.footer.blog}</li>
            <li>{dictionary?.footer["whatsapp-line"]}</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mb-4">
        {dictionary?.footer.copyright}
      </div>
    </footer>
  );
};

export default Footer;

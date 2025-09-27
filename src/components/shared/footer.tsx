"use client";

import { useState } from "react";
import { useDictionary } from "@/hooks/useDictionary";
import { useLocale } from "@/hooks/useLocale";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";

const Footer = () => {
  const { dictionary } = useDictionary();
  const [locale] = useLocale();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stock, setStock] = useState("");

  const sendContact = async () => {
    setLoading(true);
    if (!name || !phone) {
      setMessage(dictionary?.cart.order.fillAllFields || "⚠️");
      setLoading(false);
      return;
    }
    await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/send-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-locale": locale,
      },
      body: JSON.stringify({
        name,
        phone,
        stock
      }),
    })
    setLoading(false);
    setMessage("");
    setShowModal(false);
    setPhone("");
    setName("");
    setStock("");
  }


  return (
    <footer className="bg-white w-full h-full py-12 flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center mb-8">
        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          type="button"
          className="cursor-pointer border text-black border-black px-20 py-4 hover:bg-black hover:text-white transition disabled:opacity-50"
        >
          {dictionary?.shared.sendOrder}
        </button>
      </div>

      <div className="flex gap-6 mb-8">
        {dictionary?.contacts?.social?.value.map((social: any, i: number) => {
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
          <h3 className="text-md text-black underline font-semibold mb-2">
            {dictionary?.footer.policies}
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li><a href={`/${locale}/faq`}>{dictionary?.footer.sales}</a></li>
            <li><a href={`/${locale}/faq`}>{dictionary?.footer.privacy}</a></li>
            <li><a href={`/${locale}/faq`}>{dictionary?.footer["delivery-return"]}</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-md text-black underline font-semibold mb-2">
            {dictionary?.footer.company}
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li><a href={`/${locale}/blog`}>{dictionary?.footer.blog}</a></li>
            <li><a href={`/${locale}/contact`}>{dictionary?.footer.contact}</a></li>
            <li><a href={`/${locale}/about`}>{dictionary?.footer["about-us"]}</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-md text-black underline font-semibold mb-2">
            {dictionary?.footer.support}
          </h3>
          <ul className="flex flex-col items-center text-gray-500 text-sm space-y-1">
            <li><a href={`/${locale}/faq`}>{dictionary?.footer.faq}</a></li>
            <li>
              <a
                href="https://wa.me/79062302022"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dictionary?.footer["whatsapp-line"]}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs mb-4">
        {dictionary?.footer.copyright}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 transition-opacity z-50"
          onClick={() => !loading && setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-96 transform transition-all scale-95 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium mb-4">
              {dictionary?.cart.order.enterDetails}
            </h2>
            <input
              type="text"
              placeholder={dictionary?.cart.order.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="tel"
              placeholder={dictionary?.cart.order.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder={dictionary?.cart.order.stock}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            {message && <p className="text-sm text-red-500 mb-2">{message}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                {dictionary?.cart.order.cancel}
              </button>
              <button
                onClick={sendContact}
                disabled={loading}
                className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading
                  ? dictionary?.cart.order.sending
                  : dictionary?.footer.send}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer

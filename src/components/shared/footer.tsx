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

  const [email, setEmail] = useState("");
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

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("❌ Email kerak");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-locale": locale },
        body: JSON.stringify({
          to: "hojiakbarnasriddinov2006@gmail.com",
          email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Email yuborildi!");
        setEmail("");
      } else {
        setMessage("❌ Xatolik yuz berdi!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server bilan muammo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white w-full h-full py-12 flex flex-col items-center justify-center gap-10">
      {/* Newsletter */}
      <div className="flex flex-col items-center mb-8">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dictionary?.footer.placeholder}
          className="border-b border-black text-black placeholder:text-black placeholder:uppercase focus:outline-none text-center mb-4 w-72 md:w-96 p-4"
        />
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="border text-black border-black px-20 py-4 hover:bg-black hover:text-white transition disabled:opacity-50"
        >
          {loading ? "⏳..." : dictionary?.footer.send}
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>

      {/* Social icons */}
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

      {/* Footer links */}
      <div className="flex flex-col md:flex-row gap-12 text-center md:text-left">
        {/* POLICIES */}
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

        {/* COMPANY */}
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

        {/* SUPPORT */}
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

      {/* Copyright */}
      <div className="text-center text-gray-400 text-xs mb-4">
        {dictionary?.footer.copyright}
      </div>
    </footer>
  );
};

export default Footer;

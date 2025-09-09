import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import { use } from "react";
import { getDictionary } from "@/localization/dictionary";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Share2,
} from "lucide-react";

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

const Contact = () => {
  const dict = use(getDictionary());

  return (
    <div className="flex flex-col">
      <Banner filter="Contact" image="/static/image1.png" />

      <section className="px-6 md:px-24 py-12 bg-white text-gray-800">
        <div className="max-w-4xl mx-auto divide-y divide-gray-300">
          {/* Address */}
          <div className="flex items-start gap-10 py-6">
            <MapPin className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">
              {dict.contacts.Address.name}
            </h3>
            <div>
              <p className="text-sm mt-1">{dict.contacts.Address.value}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-10 py-6">
            <Phone className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">
              {dict.contacts.Phone.name}
            </h3>
            <div>
              <a
                href={`tel:${dict.contacts.Phone.value}`}
                className="text-sm mt-1 text-blue-600 hover:underline"
              >
                {dict.contacts.Phone.value}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-10 py-6">
            <Mail className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">
              {dict.contacts["E-Mail"].name}
            </h3>
            <div>
              <a
                href={`mailto:${dict.contacts["E-Mail"].value}`}
                className="text-sm mt-1 text-blue-600 hover:underline"
              >
                {dict.contacts["E-Mail"].value}
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-start gap-10 py-6">
            <MessageCircle className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">
              {dict.contacts.WhatsApp.name}
            </h3>
            <div>
              <a
                href={`https://wa.me/${dict.contacts.WhatsApp.value.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 mt-1 hover:underline"
              >
                {dict.contacts.WhatsApp.value}
              </a>
            </div>
          </div>

          {/* Instagram */}
          <div className="flex items-start gap-10 py-6">
            <Instagram className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">
              {dict.contacts.Instagram.name}
            </h3>
            <div>
              <a
                href={`https://instagram.com/${dict.contacts.Instagram.value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm mt-1 text-blue-600 hover:underline"
              >
                @{dict.contacts.Instagram.value}
              </a>
            </div>
          </div>

          {/* Social media map */}
          <div className="flex items-start gap-10 py-6">
            <Share2 className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">
              {dict.contacts.social.label}
            </h3>
            <div className="flex items-center gap-6 flex-wrap">
              {dict.contacts.social.value.map((social: any, i: number) => {
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
          </div>
        </div>
      </section>

      {/* Yandex Map */}
      <iframe
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A6c10b516473bd8e3336e1d0ce529ccf5aa08dce0c2438ecf2eeff8ab484ad83c&source=constructor"
        width="100%"
        className="aspect-video"
        style={{ border: 0 }}
        
        loading="lazy"
      ></iframe>

      <Footer />

    </div>
  );
};

export default Contact;

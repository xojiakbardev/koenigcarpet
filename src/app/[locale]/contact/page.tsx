import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
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

const Contact = () => {
  return (
    <div className="flex flex-col">
      <Banner filter={"Contact"} image={"/static/image1.png"} />

      <section className="px-6 md:px-24 py-12 bg-white text-gray-800">
        <div className="max-w-4xl mx-auto divide-y divide-gray-300">
          {/* Address */}
          <div className="flex items-center gap-10 py-6">
            <MapPin className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">ADDRESS</h3>
            <div>
              <p className="text-sm mt-1">
                Factory Showroom <br />
                İkitelli OSB Mah. Biksan Sanayi Sitesi B1 Blok 32/A
                Başakşehir-İstanbul/Türkiye
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Monday - Friday | 10:00 - 17:00, Saturday | 10:00 - 14:30
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-10 py-6">
            <Phone className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">PHONE</h3>
            <div>
              <p className="text-sm mt-1">(+90) 538 035 20 61</p>
              <p className="text-xs text-gray-500 mt-1">
                Monday - Friday | 10:00 - 17:00, Saturday | 10:00 - 14:30
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-10 py-6">
            <Mail className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">E-MAIL</h3>
            <div>
              <p className="text-sm mt-1">export@bmhome.com.tr</p>
            </div>
          </div>
          <div className="flex items-center gap-10 py-6">
            <Share2 className="w-6 h-6 text-gray-600 shrink-0" />
            <h3 className="font-semibold text-sm uppercase">SOCIAL MEDIA</h3>
            <div className="flex items-center gap-6 py-6">
              <Facebook className="w-5 h-5 text-gray-700 cursor-pointer hover:text-blue-600" />
              <Instagram className="w-5 h-5 text-gray-700 cursor-pointer hover:text-pink-500" />
              <Linkedin className="w-5 h-5 text-gray-700 cursor-pointer hover:text-blue-700" />
              <MessageCircle className="w-5 h-5 text-gray-700 cursor-pointer hover:text-green-600" />
            </div>
          </div>
        </div>
      </section>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6012.181084048882!2d28.808448!3d41.061578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa4ff2f4d79d9%3A0x6f3f2e9da6c1f3d!2sBM%20Home%20Tekstil%20A.%C5%9E!5e0!3m2!1sen!2str!4v1692500000000"
        width="100%"
        className="aspect-video"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
      <Footer />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Contact;

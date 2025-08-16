import Category from "@/components/pages/home/category";
import SlideWrapper from "@/components/pages/home/slideWrapper";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { HOME_CATEGORIES } from "@/lib/const";
import { getDictionary } from "@/localization/dictionary";
import { use } from "react";

export default function Home() {
  const dictionary = use(getDictionary())
  console.log(dictionary)
  return (
   <div className="h-screen w-full overflow-hidden relative">
    <Navbar fixed />
    <SlideWrapper elem={<Footer />}>
        {HOME_CATEGORIES.map((category) => (
          <Category key={category.title} category={category} />
        ))}
    </SlideWrapper>
   </div>
  );
}

import Categories from "@/components/pages/home/categories";
import Navbar from "@/components/shared/navbar";
import { getDictionary } from "@/localization/dictionary";
import { use } from "react";

export default function Home() {
  const dictionary = use(getDictionary())
  console.log(dictionary)
  return (
   <div className="h-screen w-full overflow-hidden relative">

    <Navbar fixed />
    <Categories/>
   </div>
  );
}

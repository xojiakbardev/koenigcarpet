import Categories from "@/components/pages/home/categories";
import Navbar from "@/components/shared/navbar";
import { getDictionary } from "@/localization/dictiionary";
import { Fragment, use } from "react";

export default function Home() {
  const dictionary = use(getDictionary())
  console.log(dictionary)
    const items = ["CUSTOM SIZE", "CUSTOM COLOR", "CUSTOM DESIGN"];
  return (
   <div className="h-screen w-full overflow-hidden relative">

    <Navbar fixed />
    <Categories/>
   </div>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Category {
  title: string;
  description: string;
  image: string;
}

const Categories: React.FC = () => {
  const categories: Category[] = [
    { title: "NEW RUGS", description: "LATEST RUG MODELS", image: "/static/image1.png" },
    { title: "ALL RUGS", description: "MADE TO ORDER RUG MODELS", image: "/static/image2.png" },
    { title: "MARQUISE", description: "INTENSE TEXTURED, VIBRANT COLORED RUGS", image: "/static/image3.png" },
    { title: "ORIENTAL", description: "CLASSIC RUGS WITH MODERN TEXTURE", image: "/static/image4.png" },
    { title: "AMORPH", description: "ORGANIC SHAPE RUGS INSPIRED BY NATURE", image: "/static/image5.png" },
    { title: "ETHNIQUE", description: "MODERN RUGS WITH TRADITIONAL MOTIF", image: "/static/image6.png" },
    { title: "SHELL", description: "NATURAL COLORED MINIMAL RUGS", image: "/static/image7.png" }
  ];

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= categories.length) return;
    isScrolling.current = true;
    setActiveIndex(index);
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    setTimeout(() => {
      isScrolling.current = false;
    }, 700);
  }, [categories.length]);

useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    if (isScrolling.current) return;
    e.preventDefault();
    const threshold = 30;

    if (e.deltaY > threshold) {
      scrollToSection(activeIndex + 1);
    } else if (e.deltaY < -threshold) {
      scrollToSection(activeIndex - 1);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); 
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null || isScrolling.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const threshold = 40;

    if (deltaY > threshold) {
      scrollToSection(activeIndex + 1);
    } else if (deltaY < -threshold) {
      scrollToSection(activeIndex - 1);
    }

    touchStartY.current = null;
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("touchstart", handleTouchStart, { passive: false });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd, { passive: false });

  return () => {
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}, [activeIndex, scrollToSection]);

  return (
    <>

      {categories.map((cat, i) => (
        <section
          key={i}
          ref={(el) => { sectionRefs.current[i] = el; }}
          className="h-screen w-full flex flex-col items-center justify-center relative"
          style={{
            backgroundImage: `url(${cat.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                priority
                className="object-cover"
                />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
              {cat.title}
            </h1>
            <p className="text-lg md:text-xl mt-3 font-light uppercase drop-shadow">
              {cat.description}
            </p>
          </div>

          {i < categories.length - 1 && (
            <button
              onClick={() => scrollToSection(i + 1)}
              className="absolute bottom-5 cursor-pointer"
            >
              <ChevronDown className="size-16 text-white" />
            </button>
          )}
        </section>
      ))}
    </>
  );
};

export default Categories;

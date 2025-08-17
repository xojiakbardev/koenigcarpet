"use client";

import clsx from "clsx";
import { Loader2, AlertTriangle } from "lucide-react";
import Image, { ImageProps } from "next/image";
import { FC, useState, useRef, useEffect } from "react";

type LazyImageProps = ImageProps & {
  className?: string; 
};

const LazyImage: FC<LazyImageProps> = ({ className, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={` ${className || ""}`}
      style={props.fill ? { width: "100%", height: "100%" } : undefined}
    >
      {loading && !error && (
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-gray-400" />
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-red-500">
          <AlertTriangle className="w-6 h-6 mb-1" />
          <span className="text-xs text-center">Rasm yuklanmadi</span>
        </div>
      )}

      {isVisible && !error && (
        <Image
          {...props}
          alt={props.alt || "Image"}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
          className={clsx(
            "transition-opacity duration-500",
            loading ? "opacity-0" : "opacity-100"
          )}        />
      )}
    </div>
  );
};

export default LazyImage;

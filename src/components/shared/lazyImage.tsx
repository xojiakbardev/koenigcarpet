import { Loader2 } from "lucide-react";
import Image from "next/image";
import { FC, useState, useRef, useEffect } from "react";

type LazyImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
};

const LazyImage: FC<LazyImageProps> = ({ src, alt, width, height, fill, className }) => {
  const [loading, setLoading] = useState(true);
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
      className={`relative ${className || ""}`}
      style={fill ? { width: "100%", height: "100%" } : undefined}
    >
      {loading && (
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      )}

      {isVisible && (
        <Image
          src={src}
          alt={alt}
          {...(fill ? { fill: true, style: { objectFit: "cover" } } : { width, height })}
          onLoadingComplete={() => setLoading(false)}
          className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
        />
      )}
    </div>
  );
};

export default LazyImage;

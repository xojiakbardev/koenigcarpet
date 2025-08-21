"use client";

import clsx from "clsx";
import { Loader2, AlertTriangle, ImageIcon } from "lucide-react";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useRef, useState, useCallback } from "react";

type LazyImageProps = ImageProps & {
  className?: string;
  showPlaceholder?: boolean;
  placeholderClassName?: string;
  loadingClassName?: string;
  errorClassName?: string;
};

const LazyImage: FC<LazyImageProps> = ({ 
  className, 
  alt, 
  sizes, 
  showPlaceholder = true,
  placeholderClassName,
  loadingClassName,
  errorClassName,
  onLoad,
  onError,
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  
  const wrapRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageLoadedRef = useRef(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    imageLoadedRef.current = false;
    setShouldLoad(false);
  }, [props.src]);

  useEffect(() => {
    if (!wrapRef.current || typeof window === 'undefined') return;

    const element = wrapRef.current;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setShouldLoad(true), 50);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(element);
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (props.priority || !showPlaceholder) {
      setIsVisible(true);
      setShouldLoad(true);
    }
  }, [props.priority, showPlaceholder]);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(false);
  }, []);

  const handleLoadComplete = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoading(false);
    setError(false);
    imageLoadedRef.current = true;
    onLoad?.(event);
  }, [onLoad]);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoading(false);
    setError(true);
    imageLoadedRef.current = false;
    onError?.(event);
  }, [onError]);

  const wrapperStyles = props.fill 
    ? { position: 'absolute' as const, inset: 0 }
    : undefined;

  return (
    <div
      ref={wrapRef}
      className={clsx("relative", className)}
      style={wrapperStyles}
    >
      {showPlaceholder && !imageLoadedRef.current && (
        <div 
          className={clsx(
            "absolute inset-0 bg-gray-200 flex items-center justify-center",
            placeholderClassName
          )}
        >
          {!isVisible ? (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          ) : null}
        </div>
      )}

      {loading && (isVisible || !showPlaceholder) && !error && (
        <div 
          className={clsx(
            "absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm",
            loadingClassName
          )}
        >
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        </div>
      )}

      {error && (
        <div 
          className={clsx(
            "absolute inset-0 flex items-center justify-center bg-gray-50",
            errorClassName
          )}
        >
          <div className="flex flex-col items-center space-y-2 text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      )}

      {(shouldLoad || !showPlaceholder) && !error && (
        <Image
          {...props}
          alt={alt || "Image"}
          sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
          onLoadStart={handleLoadStart}
          onLoad={handleLoadComplete}
          onError={handleError}
          draggable={false}
          className={clsx(
            "transition-opacity duration-500 ease-out",
            loading ? "opacity-0" : "opacity-100",
            "select-none"
          )}
          style={{
            objectFit: 'cover',
            ...props.style
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
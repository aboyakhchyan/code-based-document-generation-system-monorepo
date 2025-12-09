import { useState, useEffect, useRef, useCallback, memo } from "react";
import { cn } from "./utils";
import { Skeleton } from "./Skeleton";
import { ImageOff } from "lucide-react";

interface DynamicImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "loading"> {
  src: string | undefined | null;
  alt: string;
  fallbackSrc?: string;
  placeholder?: string;
  skeletonClassName?: string;
  showSkeleton?: boolean;
  lazy?: boolean;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  containerClassName?: string;
  errorIcon?: React.ReactNode;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

const DEFAULT_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='18'%3EImage not found%3C/text%3E%3C/svg%3E";

export const DynamicImage = memo<DynamicImageProps>(
  ({
    src,
    alt,
    fallbackSrc = DEFAULT_FALLBACK,
    placeholder,
    skeletonClassName,
    showSkeleton = true,
    lazy = true,
    blurDataURL,
    onLoad,
    onError,
    className,
    containerClassName,
    errorIcon,
    objectFit = "cover",
    ...imgProps
  }) => {
    const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading");
    const [isInView, setIsInView] = useState(!lazy);
    const [currentSrc, setCurrentSrc] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const loadedImagesRef = useRef<Set<string>>(new Set());

    useEffect(() => {
      if (!lazy || isInView) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: "50px", 
          threshold: 0.01,
        }
      );

      const currentContainer = containerRef.current;
      if (currentContainer) {
        observer.observe(currentContainer);
      }

      return () => {
        if (currentContainer) {
          observer.unobserve(currentContainer);
        }
        observer.disconnect();
      };
    }, [lazy, isInView]);

    useEffect(() => {
      if (!src) {
        setImageState("error");
        setCurrentSrc(null);
        return;
      }

      if (loadedImagesRef.current.has(src)) {
        setImageState("loaded");
        setCurrentSrc(src);
        return;
      }

      if (!isInView) {
        setImageState("loading");
        setCurrentSrc(null);
        return;
      }

      setImageState("loading");
      setCurrentSrc(src);

      const img = new Image();
      let cancelled = false;

      img.onload = () => {
        if (cancelled) return;
        loadedImagesRef.current.add(src);
        setImageState("loaded");
        setCurrentSrc(src);
      };

      img.onerror = () => {
        if (cancelled) return;
        setImageState("error");
        setCurrentSrc(fallbackSrc);
      };

      img.src = src;

      return () => {
        cancelled = true;
        img.onload = null;
        img.onerror = null;
      };
    }, [src, fallbackSrc, isInView]);

    const handleImageLoad = useCallback(() => {
      setImageState("loaded");
      onLoad?.();
    }, [onLoad]);

    const handleImageError = useCallback(() => {
      if (currentSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setImageState("error");
      } else {
        setImageState("error");
      }
      onError?.();
    }, [currentSrc, fallbackSrc, onError]);

    const isLoading = imageState === "loading" && showSkeleton;
    const hasError = imageState === "error";

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", containerClassName)}
        style={{ minHeight: imgProps.height || "auto", minWidth: imgProps.width || "auto" }}
      >
        {isLoading && (
          <Skeleton
            className={cn("absolute inset-0 w-full h-full", skeletonClassName)}
            variant="circular"
            animation="pulse"
            width={imgProps.width}
            height={imgProps.height}
          />
        )}

        {blurDataURL && isLoading && (
          <img
            src={blurDataURL}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
            aria-hidden="true"
            loading="eager"
          />
        )}

        {placeholder && isLoading && (
          <div
            className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center"
            aria-hidden="true"
          >
            <img src={placeholder} alt="" className="w-1/2 h-1/2 object-contain opacity-30" loading="eager" />
          </div>
        )}

        {isInView && currentSrc && (
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={cn(
              "transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100",
              `object-${objectFit}`,
              className
            )}
            loading={lazy ? "lazy" : "eager"}
            decoding="async"
            {...imgProps}
          />
        )}

        {hasError && (
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400",
              className
            )}
            role="img"
            aria-label={`${alt} - Image not available`}
          >
            {errorIcon || (
              <div className="flex flex-col items-center justify-center gap-2">
                <ImageOff size={32} className="text-gray-400" />
                <span className="text-xs text-gray-500">Image not found</span>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <span className="sr-only" role="status" aria-live="polite">
            Loading {alt}...
          </span>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.src === nextProps.src &&
      prevProps.alt === nextProps.alt &&
      prevProps.className === nextProps.className &&
      prevProps.containerClassName === nextProps.containerClassName &&
      prevProps.lazy === nextProps.lazy
    );
  }
);

DynamicImage.displayName = "DynamicImage";

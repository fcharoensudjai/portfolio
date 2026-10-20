import Image from "next/image";
import React, { useState } from "react";

interface ImageFrameProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  imageClassName?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  imageStyle?: React.CSSProperties;
  pulsePlaceholder?: boolean;
  onContextMenu?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  onImageLoad?: (img: HTMLImageElement) => void;
}

export const ImageFrame: React.FC<ImageFrameProps> = ({
  src,
  alt,
  className,
  placeholderClassName,
  imageClassName,
  objectFit = "cover",
  objectPosition,
  imageStyle,
  pulsePlaceholder = true,
  onContextMenu,
  onImageLoad,
}) => {
  const [isImageReady, setIsImageReady] = useState(false);

  const handleImageReady = async (img: HTMLImageElement) => {
    try {
      if (typeof img.decode === "function") {
        await img.decode();
      }
    } catch {
      // no-op: fall back to showing the image anyway
    } finally {
      setIsImageReady(true);
    }
  };

  const defaultPlaceholderClassName = "bg-surface-mid";

  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      {!isImageReady && (
        <div
          className={`absolute inset-0 z-0 ${placeholderClassName ?? defaultPlaceholderClassName} ${
            pulsePlaceholder ? "animate-pulse" : ""
          }`}
          aria-hidden="true"
        />
      )}

      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          style={{ objectFit, objectPosition, ...imageStyle }}
          fill
          onContextMenu={onContextMenu}
          onLoad={(event) => {
            handleImageReady(event.currentTarget);
            onImageLoad?.(event.currentTarget);
          }}
          onError={() => setIsImageReady(true)}
          className={`transition-opacity duration-500 ease-out ${isImageReady ? "opacity-100" : "opacity-0"} ${
            imageClassName ?? ""
          }`}
        />
      </div>
    </div>
  );
};

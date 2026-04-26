import Image from "next/image";
import React, { useState } from "react";
import { useTheme } from "next-themes";

interface ImageFrameProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  imageClassName?: string;
  objectFit?: "cover" | "contain";
  pulsePlaceholder?: boolean;
  onContextMenu?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}

export const ImageFrame: React.FC<ImageFrameProps> = ({
  src,
  alt,
  className,
  placeholderClassName,
  imageClassName,
  objectFit = "cover",
  pulsePlaceholder = true,
  onContextMenu,
}) => {
  const { theme } = useTheme();
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

  const defaultPlaceholderClassName = theme === "dark" ? "bg-middle-colour" : "bg-text-dark";

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

      <Image
        src={src}
        alt={alt}
        style={{ objectFit }}
        fill
        onContextMenu={onContextMenu}
        onLoad={(event) => handleImageReady(event.currentTarget)}
        onError={() => setIsImageReady(true)}
        className={`transition-opacity duration-500 ease-out ${isImageReady ? "opacity-100" : "opacity-0"} ${
          imageClassName ?? ""
        }`}
      />
    </div>
  );
};

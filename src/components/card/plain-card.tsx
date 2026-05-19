import React from "react";
import { ImageFrame } from "@/components/card/shared/imageframe";

interface PlainCardProps {
  src: string;
  alt: string;
  className?: string;
}

export const PlainCard: React.FC<PlainCardProps> = ({ src, alt, className = "" }) => {
  const handleContextMenu = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <ImageFrame src={src} alt={alt} onContextMenu={handleContextMenu} pulsePlaceholder={true} />
    </div>
  );
};

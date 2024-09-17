import Image from 'next/image';
import Fader from "@/components/stylers/fader";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Scramble } from "@/components/stylers/scramblerthai";
import { ImageViewer } from "@/components/imageviewer";

interface CardProps {
    src: string;
    alt: string;
    name: string;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ src, alt, name, className }) => {
    const handleContextMenu = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.preventDefault();
    };

    const [showOverlay, setShowOverlay] = useState(false);
    const toggleOverlay = () => setShowOverlay(!showOverlay);

    const { theme } = useTheme();

    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const toggleViewer = () => {
        setIsViewerOpen(!isViewerOpen);
        setShowOverlay(false);
    };

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const textBoxWidth = 175;
    const textBoxHeight = 50;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const clampedX = Math.min(Math.max(mouseX, textBoxWidth / 2), rect.width - textBoxWidth / 2);
        const clampedY = Math.min(Math.max(mouseY, textBoxHeight / 2), rect.height - textBoxHeight / 2);

        setMousePosition({ x: clampedX, y: clampedY });
    };

    return (
        <motion.div
            className={`relative overflow-hidden rounded-xl min-h-[300px] xl:min-h-[400px] 2xl:min-h-[500px] flex justify-center items-center ${className}`}
            onHoverStart={toggleOverlay}
            onHoverEnd={toggleOverlay}
            onMouseMove={handleMouseMove}
        >
            <Fader once={true} threshold={0.4}>
                <AnimatePresence>
                    {showOverlay && (
                        <motion.div
                            className="inset-0 z-10 absolute flex justify-center items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                            style={{ cursor: showOverlay ? "none" : "default" }}
                        >
                            <div
                                className={`absolute inset-0 backdrop-blur-[2px] ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"} bg-opacity-60`}
                            >
                                <motion.div
                                    className="absolute border-corner z-20 flex justify-center items-center"
                                    style={{
                                        top: mousePosition.y - textBoxHeight / 2 + 10,
                                        left: mousePosition.x - textBoxWidth / 2 + 10,
                                        width: textBoxWidth,
                                        height: textBoxHeight,
                                    }}
                                    initial={{scale: 1.3}}
                                    animate={{scale: 1}}
                                    exit={{scale: 1.3}}
                                    whileTap={{scale: 0.9}}
                                    onClick={toggleViewer}
                                >
                                    <Scramble interval={20} hover={true}> see full image </Scramble>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Image
                    src={src}
                    alt={alt}
                    style={{objectFit: "cover"}}
                    fill
                    onContextMenu={handleContextMenu}
                    onClick={toggleViewer}
                />
            </Fader>

            <ImageViewer
                name={name}
                src={src} alt={alt}
                isViewerOpen={isViewerOpen}
                toggleViewer={toggleViewer}
            />
        </motion.div>
    );
};

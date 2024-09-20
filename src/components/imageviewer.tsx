import { useTheme } from "next-themes";
import React from "react";
import Image from "next/image";
import { Scramble } from "@/components/stylers/scramblerthai";

interface ViewerProps {
    src: string;
    alt: string;
    name: string;
    toggleViewer: () => void;
    prevImage: () => void;
    nextImage: () => void;
}

export const ImageViewer: React.FC<ViewerProps> = ({ src, alt, name, toggleViewer, prevImage, nextImage }) => {

    const { theme } = useTheme();

    const handleContextMenu = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.preventDefault();
    };

    return (
        <div className={`fixed flex justify-center items-center h-[100dvh] inset-0 z-30`}>
            <div className={``}>
                <div className={`flex flex-col space-y-3 md:space-y-5 justify-center items-center`}>

                    <div className={`md:text-sm xl:text-md text-xs`}>[ <Scramble delay={750} hover={true} interval={30} navigate={true}>{name}</Scramble> ]
                    </div>

                    <div className={`flex justify-center items-center`}>

                        <div className={`flex flex-row space-x-1 md:space-x-7 px-1 md:px-3 lg:px-7`}>
                            <button onClick={prevImage}>
                                <Image
                                    src={theme === "dark" ? "/icons/dark/leftarrowdark.svg" : "/icons/light/leftarrow.svg"}
                                    alt="previous image"
                                    width={35}
                                    height={35}
                                    className="max-w-[40px]"
                                />
                            </button>

                            <div
                                className="relative flex items-center justify-center">
                                <Image
                                    src={src}
                                    alt={alt}
                                    layout="intrinsic"
                                    width={5000}
                                    height={5000}
                                    style={{objectFit: "contain"}}
                                    onContextMenu={handleContextMenu}
                                    className={"max-h-[78dvh] max-w-[75dvw]"}
                                />
                            </div>


                            <button onClick={nextImage}>
                                <Image
                                    src={theme === "dark" ? "/icons/dark/rightarrowdark.svg" : "/icons/light/rightarrow.svg"}
                                    alt="next image"
                                    width={35}
                                    height={35}
                                    className="max-w-[40px]"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <button onClick={toggleViewer} aria-label="close viewer">
                    <Image
                        src={theme === "dark" ? "/icons/dark/closedark.svg" : "/icons/light/close.svg"}
                        alt="close navigation"
                        width={35}
                        height={35}
                        className="max-w-[40px] fixed right-[1.36rem] md:right-5 lg:right-6 top-[75.48px] xl:top-[103.22px]"
                    />
                </button>
            </div>
        </div>
    )
}
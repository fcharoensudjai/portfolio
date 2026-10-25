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
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const handleContextMenu = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <div className={`fixed flex justify-center items-center h-[100dvh] inset-0 z-30`}>
      <div className={`mt-[var(--nav-clearance)] w-full`}>
        <div className={`flex flex-col space-y-3 md:space-y-5 justify-center items-center py-3 lg:py-5`}>
          {/* the title and the close share one row: the X sits on the title's own line, flush with
              the page gutter (`px-6 md:px-16 xl:px-20`, the same the gallery copy uses), instead of
              being pinned to a top offset that never lined up with the centred block */}
          <div className="relative flex w-full items-center justify-center px-6 md:px-16 xl:px-20">
            {/* the body step, the same one every paragraph carries: this used to climb to `text-md`
                at xl, so the caption under the print was the only prose on the site at 20px */}
            <div className={`text-xs md:text-sm`}>
              [{" "}
              <Scramble delay={750} hover={true} interval={30} navigate={true}>
                {name}
              </Scramble>{" "}
              ]
            </div>

            {/* the theme switch's exact box and glyph size (36px control, 30px mark), and its exact
                right rail: the nav row is `px-4 md:px-6`, so the X sits 25.6/38.4px off the edge
                rather than on the content gutter, which left it floating well inside the screen */}
            <button
              onClick={toggleViewer}
              aria-label="close viewer"
              className="absolute right-4 flex h-[36px] w-[36px] items-center justify-center md:right-6"
            >
              <Image
                src={theme === "dark" ? `${basePath}/icons/dark/closedark.svg` : `${basePath}/icons/light/close.svg`}
                alt="close navigation"
                width={30}
                height={30}
              />
            </button>
          </div>

          <div className={`flex justify-center items-center`}>
            {/* `items-center` is the whole point: the row stretches by default, and a button with a
                definite height sits at the cross-start of a stretch row — so the arrows were riding
                the top edge of the print instead of its centre line */}
            <div className={`flex flex-row items-center space-x-1 md:space-x-7 px-1 md:px-3 lg:px-7`}>
              {/* an explicit 36px box, the same one the theme switch uses: the petal flock rings a
                  target by measuring its link/button, so a button that only wraps its icon gives it
                  something to hug */}
              <button
                onClick={prevImage}
                aria-label="previous image"
                className="flex h-[36px] w-[36px] shrink-0 items-center justify-center"
              >
                <Image
                  src={
                    theme === "dark"
                      ? `${basePath}/icons/dark/leftarrowdark.svg`
                      : `${basePath}/icons/light/leftarrow.svg`
                  }
                  alt="previous image"
                  width={35}
                  height={35}
                  className="max-w-[40px]"
                />
              </button>

              <div className="relative flex items-center justify-center">
                <Image
                  src={src}
                  alt={alt}
                  layout="intrinsic"
                  width={5000}
                  height={5000}
                  style={{ objectFit: "contain" }}
                  onContextMenu={handleContextMenu}
                  className={"max-h-[78dvh] max-w-[75dvw]"}
                />
              </div>

              <button
                onClick={nextImage}
                aria-label="next image"
                className="flex h-[36px] w-[36px] shrink-0 items-center justify-center"
              >
                <Image
                  src={
                    theme === "dark"
                      ? `${basePath}/icons/dark/rightarrowdark.svg`
                      : `${basePath}/icons/light/rightarrow.svg`
                  }
                  alt="next image"
                  width={35}
                  height={35}
                  className="max-w-[40px]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

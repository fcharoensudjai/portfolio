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
    <div className={`fixed inset-0 z-30 flex h-[100dvh] items-center justify-center`}>
      {/* The close is overlaid, not a row: carving a band for it took height off the print for a
          36px control. It sits in the corner on the nav's own rail (`px-4 md:px-6`).
          The nudge is the icon's own ink, not taste. The nav aligns *ink* to its padding line: the
          theme switch gets `-3px` on its 36px box plus a 3.14px inner nudge so the sun's rays land
          exactly on the row edge. `close.svg` draws its X from 7.5 to 22.5 of 30 (6.25px of air at
          30px, plus the 3px of centring inside the 36px box), so without pulling the button out by
          that 9.25px the X sits 9px further in than the sun. */}
      <button
        onClick={toggleViewer}
        aria-label="close viewer"
        className="absolute right-4 top-[var(--nav-clearance)] -mr-[9.25px] flex h-[36px] w-[36px] items-center justify-center md:right-6"
      >
        <Image
          src={theme === "dark" ? `${basePath}/icons/dark/closedark.svg` : `${basePath}/icons/light/close.svg`}
          alt="close navigation"
          width={30}
          height={30}
        />
      </button>

      <div className={`mt-[var(--nav-clearance)] w-full`}>
        <div className={`flex flex-col items-center justify-center gap-3 py-3 md:gap-5 lg:py-5`}>
          {/* the body step, the same one every paragraph carries: this used to climb to `text-md` at
              xl, so the caption under the print was the only prose on the site at 20px */}
          <div className={`text-xs md:text-sm`}>
            [{" "}
            <Scramble delay={750} hover={true} interval={30} navigate={true}>
              {name}
            </Scramble>{" "}
            ]
          </div>

          {/* the arrows are pinned to the gutters — prev on the logo's rail, next on the theme
              switch's — with the print taking whatever is left between them. `items-center` puts them
              on the print's centre line: a stretch row parks a definite-height button at the
              cross-start, which is what had them riding the top edge. */}
          <div className={`flex w-full items-center justify-between gap-2 px-4 md:gap-6 md:px-6`}>
            {/* an explicit 36px box, the same one the theme switch uses: the petal flock rings a
                target by measuring its link/button, so a button that only wraps its icon gives it
                something to hug */}
            {/* `-ml-[7.3px]` is the arrow's ink: the glyph stops ~6.8px inside its 35px box (plus
                0.5px of centring), so pulling the button out lands the arrowhead on the same rail the
                logo's ink sits on — same reason the header nudges its hamburger */}
            <button
              onClick={prevImage}
              aria-label="previous image"
              className="-ml-[7.3px] flex h-[36px] w-[36px] shrink-0 items-center justify-center"
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

            <div className="relative flex min-w-0 flex-1 items-center justify-center">
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

            {/* mirrored: the same 7.3px so the arrowhead's ink, not its box, lands on the theme
                switch's rail */}
            <button
              onClick={nextImage}
              aria-label="next image"
              className="-mr-[7.3px] flex h-[36px] w-[36px] shrink-0 items-center justify-center"
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
  );
};

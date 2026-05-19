import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Title } from "@/components/title";
import { PlainCard } from "@/components/card/plain-card";
import { Scramble } from "@/components/stylers/scramblerthai";
import { Textbox } from "@/components/textbox";
import { DottedLineSeparator } from "@/components/dottedlineseparator";
import Fader from "@/components/stylers/fader";
import { aboutSequenceItems } from "./about-data";

export interface AboutPanelProps {
  item: (typeof aboutSequenceItems)[0];
  index: number;
  setActiveIndex: (index: number) => void;
  basePath: string;
  theme?: string;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ item, index, setActiveIndex, basePath, theme }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    rootMargin: "-10% 0px -20% 0px",
  });

  useEffect(() => {
    if (inView) {
      setActiveIndex(index);
    }
  }, [inView, index, setActiveIndex]);

  return (
    <div
      id={`about-card-${index}`}
      ref={ref}
      className="min-h-[100vh] w-full flex flex-col justify-center py-12 xl:py-0"
    >
      {/* Mobile Title (shown only on small screens) */}
      <Fader>
        <div className="xl:hidden w-full mb-4">
          <div className="mb-2 font-mono text-sm opacity-100">
            <DottedLineSeparator align="left"> [ {item.id} ] </DottedLineSeparator>
          </div>
          <Title size="small">{item.title}</Title>
        </div>
      </Fader>

      <Fader>
        <div
          className={`flex ${item.hideImage ? "flex-col" : "flex-col-reverse lg:flex-row"} gap-6 md:gap-8 lg:gap-10 2xl:gap-16 w-full ${item.hideImage ? "" : "items-center justify-between"}`}
        >
          {/* Left Side: Image (Bottom on mobile) */}
          {!item.hideImage && (
            <div className="w-full lg:w-[45%]">
              <PlainCard
                src={`${basePath}${item.image.src}`}
                alt={item.image.alt}
                className="w-full h-auto aspect-[4/5] object-cover max-h-[40vh] md:max-h-[50vh] lg:max-h-[75vh]"
              />
            </div>
          )}

          {/* Right Side: Text (Top on mobile) */}
          <div
            className={`${item.hideImage ? "w-full" : "w-full lg:w-[55%]"} flex flex-col justify-center text-xs md:text-sm xl:text-md text-justify font-mono leading-relaxed lg:leading-[1.8]`}
          >
            <Scramble
              delay={100}
              interval={8}
              preScrambled={true}
              renderCustom={(nodes) => {
                return (
                  <div className="space-y-6">
                    {nodes.map((node, pIndex) => {
                      const isLast = pIndex === nodes.length - 1;
                      return <div key={pIndex}>{isLast ? <Textbox>{node}</Textbox> : <p>{node}</p>}</div>;
                    })}
                  </div>
                );
              }}
            >
              {item.paragraphs.join("|||")}
            </Scramble>
          </div>
        </div>
      </Fader>
    </div>
  );
};

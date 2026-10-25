import Image from "next/image";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";

interface ChapterBandProps {
  basePath: string;
  eyebrow: string;
  title: string;
  paragraph: string;
  image: string;
  alt: string;
}

/**
 * 02 · the band. The only chapter with no scroll maths of its own: the head rises over the tail of
 * 01's fold (hence the negative top margin) and the photo runs full width underneath it.
 */
export const ChapterBand = ({ basePath, eyebrow, title, paragraph, image, alt }: ChapterBandProps) => {
  return (
    <section className="relative z-[3] -mt-[28vh] flex min-h-[100dvh] flex-col bg-surface" aria-label={title}>
      {/* the text→image gap on a phone is 02's copy of 01's bottom offset (9vh): both chapters put
          copy above a full-width print, so the two distances have to be the same number or the
          pair reads as two different layouts. From md the stage is roomy enough for the tighter step. */}
      <div className="flex flex-1 flex-col justify-center px-6 pb-[9vh] pt-[var(--nav-clearance)] md:px-16 md:pb-[5vh] xl:px-20">
        <div className="mb-3 md:mb-4">
          <div className="mb-2 text-ink-secondary">
            <Textbox size="label" caret={false}>
              <span className="tracking-[0.06em]">{eyebrow}</span>
            </Textbox>
          </div>
          <div className="fixed-line-spacing">
            <Title size="display">{title}</Title>
          </div>
        </div>

        <div className="max-w-[52rem] text-ink-secondary">
          <Textbox size="caption" caret={false}>
            <Scramble delay={400} once={false} preScrambled>
              {paragraph}
            </Scramble>
          </Textbox>
        </div>
      </div>

      <figure className="relative h-[50dvh] flex-none overflow-hidden">
        <Image
          src={`${basePath}${image}`}
          alt={alt}
          fill
          style={{ objectPosition: "center 45%" }}
          className="object-cover"
        />
      </figure>
    </section>
  );
};

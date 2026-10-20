import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";
import { SocialIcons } from "@/components/footer/socialicons";
import { useVisibility3 } from "@/app/contexts/contactvisibilitycontext";
import { useInView } from "react-intersection-observer";
import React from "react";
import { Petal } from "@/components/petal";

interface ContactProps {
  once?: boolean; // whether the mail line scrambles only the first time it enters view
}

export const Contact = ({ once = true }: ContactProps) => {
  // controlling the underlining for the contact section

  const { setIsContactInView } = useVisibility3();

  const { ref: contactRef, inView: isContactInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // used to update the context with visibility state
  React.useEffect(() => {
    setIsContactInView(isContactInView);
  }, [isContactInView, setIsContactInView]);

  return (
    <div ref={contactRef} id="contact" className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-surface">
      {/* the CTA: centred, with the mail directly beneath it and nothing beside it */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-[var(--nav-clearance)] text-center md:px-16 xl:px-20">
        <Title size="close">
          <div className="relative fixed-line-spacing whitespace-nowrap">
            {"get in touch!"}
            <Petal positioning="left-[30.5%] bottom-[73.5%] sm:left-[30.75%] sm:bottom-[74%] 2xl:left-[31%]" />
          </div>
        </Title>

        {/* draggable={false}: without it a drag on a link starts a native link-drag, which is why
            the address couldn't be selected and copied */}
        <a
          href="mailto:fuzz.ch04@gmail.com"
          draggable={false}
          className="mt-7 inline-block text-xs text-ink md:mt-9 md:text-sm"
        >
          <Textbox size="caption">
            <Scramble delay={2000} interval={15} once={once}>
              {"[ mail | fuzz.ch04@gmail.com ]"}
            </Scramble>
          </Textbox>
        </a>
      </div>

      {/* the foot: the year on the left, socials on the right — two items, so there's no third thing
          to place and nothing can sit awkwardly between them. The clock moved out: it has its home in
          the landing hero row, and repeating it here competed with the year for the same slot. */}
      <div className="flex items-center justify-between gap-4 px-4 pb-[1.375rem] text-xs md:px-6 md:pb-4 md:text-sm xl:pb-6">
        {/* inherits the row's size (md:text-sm) and uses ink, matching the socials beside it — the
            override to text-xs was what made it read as smallprint.
            Two wordings. Below md the socials collapse to icons (~156px), so "© 2026" is already
            enough to balance them. From md they're four text links (~449px) and the short form looks
            weightless — but the long form needs ~269px, and 269 + 449 + gap doesn't fit the 691px of
            usable width at 768, so it wrapped. `lg` is the first breakpoint that genuinely holds it. */}
        <div className="text-ink">
          <span className="lg:hidden">© 2026</span>
          <span className="hidden lg:inline">© 2026 — all rights reserved</span>
        </div>

        <div className="shrink-0">
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

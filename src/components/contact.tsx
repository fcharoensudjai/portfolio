import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";
import { useVisibility3 } from "@/app/contexts/contactvisibilitycontext";
import { useInView } from "react-intersection-observer";
import React from "react";
import { Petal } from "@/components/petal";

export const Contact = () => {
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
    <div
      ref={contactRef}
      id="contact"
      className="flex justify-center flex-col lg:min-h-[85dvh] min-h-[70dvh] scroll-mt-[75.58px] xl:scroll-mt-[103.22px]"
    >
      <div className={"flex flex-grow justify-center items-center w-full"}>
        <div className={`relative`}>
          <Title size="large">
            get{" "}
            <span className="relative inline-block align-baseline">
              i
              <span
                className="absolute left-[12%] -translate-x-1/2 top-[12%] w-0 h-0"
                style={{ pointerEvents: "none" }}
                aria-hidden="true"
              >
                <Petal enterDelay={0} positioning="" />
              </span>
            </span>
            n touch!
          </Title>
        </div>
      </div>
      <div className="flex justify-end items-center p-3 md:p-5">
        <a href="mailto:fuzz.ch04@gmail.com">
          <Textbox>
            <Scramble delay={2000} interval={15}>
              {" [ mail | fuzz.ch04@gmail.com ] "}
            </Scramble>
          </Textbox>
        </a>
      </div>
    </div>
  );
};

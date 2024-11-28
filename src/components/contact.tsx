import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";
import { useVisibility3 } from "@/app/contactvisibilitycontext";
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
        <div ref={contactRef} id="contact" className="flex justify-center flex-col lg:min-h-[85dvh] min-h-[70dvh] scroll-mt-[75.58px] xl:scroll-mt-[103.22px]">

            <div className={"flex flex-grow justify-center items-center w-full"}>
                <div className={`relative`}>
                    <Title size="large">
                    get in touch! <Petal enterDelay={0} positioning="left-[31%] bottom-[66%] sm:left-[31%] sm:bottom-[66%] lg:bottom-[79%] xl:bottom-[78%] 2xl:left-[31.25%]"/>
                </Title></div>
            </div>

            <div className="flex justify-end items-center p-3 md:p-5">
                <a href="mailto:fuzz.ch04@gmail.com"><Textbox>
                    <Scramble delay={2000} interval={15}> [ mail | fuzz.ch04@gmail.com ]</Scramble>
                </Textbox></a>
            </div>
        </div>
    )
}
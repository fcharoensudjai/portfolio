"use client";

import React, { useState, useEffect } from "react";
import { Title } from "@/components/title";
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/header/mobilenav";
import { LocalTime } from "@/components/footer/localtime";
import { SocialIcons } from "@/components/footer/socialicons";
import { Footer } from "@/components/footer/footer";
import { Textbox } from "@/components/textbox";
import { Contact } from "@/components/contact";
import Image from "next/image";
import { DottedLineSeparator } from "@/components/dottedlineseparator";
import { Button } from "@/components/button";
import { Scramble } from "@/components/stylers/scramblerthai";
import Fader from "@/components/stylers/fader";
import { Preloader } from "@/components/stylers/page-loading/preloader";
import { useInView } from "react-intersection-observer";
import { useVisibility } from "@/app/recentsvisibilitycontext";
import { useVisibility2 } from "@/app/introvisibilitycontext";
import { motion, useMotionValue, animate } from "framer-motion";
import { Petal } from "@/components/petal";

export default function Home() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    // controlling the underlining for the recents section

    const { setIsRecentsInView } = useVisibility();
    const { ref: recentsRef, inView: isRecentsInView } = useInView({
        threshold: 0.5,
        triggerOnce: false,
    });

    // used to update the recents context with visibility state
    React.useEffect(() => {
        setIsRecentsInView(isRecentsInView);
    }, [isRecentsInView, setIsRecentsInView]);

    // controlling the underlining for the intro section

    const { setIsIntroInView } = useVisibility2();

    const { ref: introRef, inView: isIntroInView } = useInView({
        threshold: 0.5,
        triggerOnce: false,
    });

    // used to update the intro context with visibility state
    React.useEffect(() => {
        setIsIntroInView(isIntroInView);
    }, [isIntroInView, setIsIntroInView]);

    // flower rotating speed
    const rotateValue = useMotionValue(0);
    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);
    const defaultDuration = 7
    const [duration, setDuration] = useState(defaultDuration);


    useEffect(() => {
        let controls;
        const finalRotation = 360;

        if (mustFinish) {
            controls = animate(rotateValue, [rotateValue.get(), finalRotation], {
                ease: "linear",
                duration: duration * (1 - rotateValue.get() / finalRotation),
                onComplete: () => {
                    setMustFinish(false);
                    setRerender(!rerender);
                },
            });
        } else {
            controls = animate(rotateValue, [0, finalRotation], {
                ease: "linear",
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
            });
        }

        return controls?.stop;
    }, [rerender, rotateValue, duration, mustFinish]);


    // changing rotation direction of flower

    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
    const [prevScrollY, setPrevScrollY] = useState(0);
    const [prevScrollDirection, setPrevScrollDirection] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > prevScrollY) {
                setScrollDirection('down');
            } else if (currentScrollY < prevScrollY) {
                setScrollDirection('up');
            }

            setPrevScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollY]);

    useEffect(() => {
        let controls;

        const rotationDirection = scrollDirection === 'up' ? -360 : 360;

        controls = animate(rotateValue, [rotateValue.get(), rotationDirection], {
            ease: "linear",
            duration: duration,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0,
        });

        return () => controls?.stop();
    }, [scrollDirection, rotateValue, duration]);


    return (
        <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

            <Preloader duration={1100} texts={["hello", "สวัสดี"]} delay={500} />

            <div id="home" className={`flex flex-col min-h-dvh ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

                <main className="flex flex-col flex-grow items-start justify-center text-left text-xs sm:text-md px-6 md:px-16 xl:px-20">

                    <Fader enterDelay={1.5} once={true}>

                        <Title size="large">
                            <div className="relative fixed-line-spacing mt-[75.58px] xl:mt-[103.22px]">
                                fasai <br/> charoensudjai <Petal positioning="left-[96.5%] bottom-[37.75%] sm:left-[96.75%] sm:bottom-[36.5%] 2xl:left-[97%]" />
                            </div>
                        </Title>

                        <div className="my-4">
                            <Textbox>
                                <Scramble delay={2000} hover={true} interval={20}>[ scroll to explore ]</Scramble>
                            </Textbox>
                        </div>

                    </Fader>
                </main>

                <div className="flex justify-between items-center px-3 md:px-5 py-3 bg-transparent">
                    <LocalTime/>
                    <SocialIcons/>
                </div>

                <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

            </div>

            <div id="recents"
                 className="px-6 md:px-16 xl:px-20 md:space-y-[25dvh] lg:space-y-12 my-7">

                <div ref={recentsRef} className="md:sticky md:top-0 md:z-10">
                    <Fader>
                        <div className="flex min-h-[100dvh] justify-center items-center">

                            <div className="flex flex-col space-y-6 lg:space-y-7 xl:space-y-10">

                                <Title size="medium">
                                    <div
                                        className="fixed-line-spacing scroll-mt-[120.28px] lg:scroll-mt-[148.02px]"> recent works
                                    </div>
                                </Title>


                                <div className="lg:w-[65%]">
                                    <Textbox>
                                        <Scramble>
                                            Here are the previews for some of the pieces I've been working on lately.
                                            Feel
                                            free to click on them to see the full image, view some more details,
                                            or click on the gallery button to view all of them!
                                        </Scramble>
                                    </Textbox>
                                </div>

                                <div><Button href="/gallery"> view my gallery </Button> </div>
                            </div>

                        </div>
                    </Fader>
                </div>

                <div className={`md:sticky md:top-0 md:z-10 ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
                    <Fader>
                        <div className="flex md:h-[100dvh] justify-center items-center my-[20dvh]">
                            <div className="py-20 xl:py-0 space-y-3 lg:space-y-5">

                                <div className="lg:hidden">
                                    <DottedLineSeparator align="left"> [ 01 ] </DottedLineSeparator>
                                </div>

                                <div className="lg:hidden"><Title size="small"> raiden shogun </Title></div>

                                <div className="flex flex-col lg:flex-row lg:justify-between justify-center lg:space-x-16 space-y-3 md:space-y-7 lg:space-y-0 lg:py-12">

                                    <div className="relative lg:w-[65%] md:min-h-[35dvh] max-h-full">
                                        <Image
                                            src="/images/raiden-shogun/raiden-home.png"
                                            alt="snippet of raiden shogun"
                                            width={1183}
                                            height={851}
                                            style={{objectFit: "cover"}}
                                            quality={60}
                                            className="w-full h-auto lg:h-full lg:w-full rounded-xl"
                                        />
                                    </div>


                                    <div className="lg:min-w-[45%] lg:max-w-[45%] flex flex-col lg:space-y-5">

                                        <div className="hidden lg:block"><DottedLineSeparator align="left"> [ 01 ] </DottedLineSeparator></div>

                                        <div className="hidden lg:block"><Title size="small"> raiden shogun </Title> </div>

                                        <div className="flex flex-col justify-evenly lg:space-y-7">

                                            <div className={`flex flex-grow w-full`}>
                                                <div
                                                    className={`flex flex-grow items-center justify-center min-h-[100px] md:min-h-[150px] lg:min-h-[250px]`}>
                                                    <Textbox>
                                                        <Scramble>
                                                            Raiden Shogun has been my favourite character from Genshin
                                                            Impact
                                                            for the longest time, and so I wanted to capture her energy.
                                                            Inspired by the League of Legends splash art styles, this is
                                                            one of the biggest digital canvases I've ever worked on, and
                                                            I’m
                                                            really happy with how it turned out.
                                                        </Scramble>
                                                    </Textbox>
                                                </div>
                                            </div>

                                            <div className="hidden lg:block justify-start"><Button href=""> more detail </Button></div>

                                        </div>

                                    </div>

                                    <div className="lg:hidden flex justify-center items-center"><Button href=""> more detail </Button></div>

                                </div>
                            </div>
                        </div>
                    </Fader>
                </div>

                <div className={`md:sticky md:top-0 md:z-10 ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
                    <Fader>
                        <div className="flex md:h-[100dvh] justify-center items-center my-[20dvh]">
                            <div className="py-20 xl:py-0 lg:py-0 space-y-3 lg:space-y-5">

                                <div className="lg:hidden"><DottedLineSeparator align="left"> [ 02 ] </DottedLineSeparator>
                                </div>

                                <div className="lg:hidden"><Title size="small"> raven </Title></div>

                                <div className="flex flex-col lg:flex-row-reverse lg:space-x-reverse lg:justify-between justify-center lg:space-x-16 space-y-4 md:space-y-7 lg:space-y-0 lg:py-12">

                                    <div className="relative lg:w-[65%] md:min-h-[35dvh] max-h-full">
                                        <Image
                                            src="/images/raven/raven-home.png"
                                            alt="snippet of raven"
                                            width={1183}
                                            height={851}
                                            style={{
                                                objectFit: "cover",
                                                objectPosition: "80% 50%"
                                            }}
                                            quality={80}
                                            className="w-full h-auto lg:h-full lg:w-auto rounded-xl"
                                        />
                                    </div>


                                    <div className="lg:min-w-[45%] lg:max-w-[45%] flex flex-col lg:space-y-5">

                                        <div className="hidden lg:block"><DottedLineSeparator align="right"> [ 02 ] </DottedLineSeparator></div>

                                        <div className="hidden lg:block text-end"><Title size="small"> raven </Title> </div>

                                        <div className="flex flex-col lg:space-y-7">

                                            <div className={`flex flex-grow w-full`}>
                                                <div
                                                    className={`flex flex-grow items-center justify-center min-h-[135px] md:min-h-[150px] lg:min-h-[250px] lg:text-end`}>
                                                    <Textbox>
                                                        <Scramble>
                                                            I joined a "Draw This In Your Style Challenge" for
                                                            Raven, a character by another artist.
                                                            It was a great learning experience, especially for
                                                            drawing metal and improving on backgrounds.
                                                            This project helped me grow as an artist, and I was very
                                                            happy to be featured on the front of the artist's post!
                                                        </Scramble>
                                                    </Textbox>
                                                </div>
                                            </div>

                                            <div className="hidden lg:flex justify-end"><Button href=""> more detail </Button></div>

                                        </div>

                                    </div>

                                    <div className="lg:hidden flex justify-center items-center"><Button href=""> more detail </Button></div>

                                </div>
                            </div>
                        </div>
                    </Fader>
                </div>

                <div className={`sticky top-0 z-10 ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
                    <Fader enterDelay={0.6} threshold={0.3}>
                        <div className="flex h-[100dvh] justify-center items-center">
                            <div className="mt-[75.48px] lg:mt-[103.22px]">
                                <div className="flex justify-center items-center">
                                    <Button href="/gallery"> view my gallery </Button>
                                </div>
                            </div>
                        </div>
                    </Fader>
                </div>

                <div className={`sticky top-0 z-0 bg-transparent`}>
                    <div className="flex h-[50dvh] justify-center items-center"> </div>
                </div>


            </div>

            <div id="intro"
                 className=" px-6 md:px-16 xl:px-20 space-y-5 lg:space-y-12 my-7 min-h-[100dvh] flex flex-col justify-center items-start">

                <Fader>
                    <div ref={introRef} className={`py-[75.48px] flex flex-col justify-center md:flex-row md:justify-between space-y-5 sm:space-y-0`}>
                        <div id="" className="md:hidden fixed-line-spacing">
                            <Title size="medium">
                                a brief intro
                            </Title>
                        </div>

                        <div
                            className="flex flex-col justify-center lg:justify-between space-y-5 sm:flex-row-reverse sm:space-x-reverse lg:space-x-reverse xl:space-x-reverse sm:space-y-0 ">

                            <motion.div
                                className="flex justify-center items-center"
                                style={{ rotate: rotateValue }}
                                onHoverStart={() => {
                                    setMustFinish(true);
                                    setDuration(15);
                                }}
                                onHoverEnd={() => {
                                    setMustFinish(true);
                                    setDuration(defaultDuration);
                                }}
                            >
                                <Image
                                    src={theme === "dark" ? "/icons/dark/logodark.svg" : "/icons/light/logo.svg"}
                                    alt="logo"
                                    width={1000}
                                    height={1000}
                                    style={{
                                        objectFit: "contain",
                                    }}
                                    className="xl:p-2 2xl:p-10 max-w-[75%] h-full"
                                />
                            </motion.div>

                            <div className="sm:max-w-[55%] sm:space-y-5 lg:space-y-7 xl:space-y-10 flex flex-col justify-center items-start">
                                <div className="hidden md:block fixed-line-spacing">

                                    <Title size="medium">
                                        a brief intro
                                    </Title>

                                </div>

                                <div className="flex flex-col justify-center items-center">
                                    <Textbox>
                                        <Scramble>
                                            Hi, I’m Fasai, an artist from Thailand and an Economics student at the
                                            University of Warwick!
                                            I created this website to showcase my passion for illustration, concept art
                                            and
                                            fanart, combining my love for art with web design in a way that's true to my
                                            style.
                                            Click the button below to learn more about my journey!
                                        </Scramble>
                                    </Textbox>
                                </div>

                                <div className={"justify-start hidden sm:block"}><Button href="/about"> read my
                                    story </Button>
                                </div>
                            </div>

                            <div className="sm:hidden flex justify-center items-center"><Button href="/about"> read my
                                story </Button></div>

                        </div>
                    </div>
                </Fader>

            </div>

            <Fader> <Contact/> </Fader>

            <Footer/>

        </div>

    );
}

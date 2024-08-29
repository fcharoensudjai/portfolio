"use client";

import React, { useState, useRef } from "react";
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/header/mobilenav";
import { Footer } from "@/components/footer/footer";
import { Contact } from "@/components/contact";
import Fader from "@/components/stylers/fader";


export default function Gallery() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const sectionRefs = {
        home: useRef<HTMLDivElement>(null),
        recents: useRef<HTMLDivElement>(null),
        intro: useRef<HTMLDivElement>(null),
        contact: useRef<HTMLDivElement>(null),
    };

    return (
        <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

            <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

            <Fader> <Contact/> </Fader>

            <Footer/>

        </div>

    );
}

"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/header/mobilenav";
import { Footer } from "@/components/footer/footer";
import { Contact } from "@/components/contact";
import Fader from "@/components/stylers/fader";
import { Preloader } from "@/components/stylers/preloader";


export default function Gallery() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    return (
        <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

            <Preloader texts={['about']}/>
            <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

            <Fader> <Contact/> </Fader>

            <Footer/>

        </div>

    );
}

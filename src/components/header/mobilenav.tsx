import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import ThemeSwitch from "@/components/header/themeswitch";
import { LogoButton } from "@/components/logobutton";
import { LocalTime } from "@/components/footer/localtime";
import { SocialIcons } from "@/components/footer/socialicons";
import { Poppins } from "next/font/google";
import { Scrollbar } from "@/components/header/scrollbar";
import { UnderlinedLink } from "@/components/underlinedlink"
import { useVisibility } from "@/app/recentsvisibilitycontext";
import { useVisibility2 } from "@/app/introvisibilitycontext";
import { useVisibility3 } from "@/app/contactvisibilitycontext";
import { usePathname } from "next/navigation";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

interface MobileNavProps {
    isNavOpen: boolean;
    toggleNav: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isNavOpen, toggleNav }) => {

    const { theme } = useTheme();
    const pathname = usePathname();

    useEffect(() => {
        if (isNavOpen) {
            toggleNav();
        }
    }, [pathname]);

    const { isRecentsInView } = useVisibility();
    const { isIntroInView } = useVisibility2();
    const { isContactInView } = useVisibility3();

    return (

        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: isNavOpen ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-0 z-50 ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"} ${poppins.className}`}
        >
            <Scrollbar />

            <div className={`flex flex-col h-full ${poppins.className}`}>

                <div className="flex items-center justify-between px-4 py-2">
                    <LogoButton />
                    <div className="flex items-center space-x-3">
                        <ThemeSwitch />
                        <button onClick={toggleNav} aria-label="close navigation">
                            <Image
                                src={theme === "dark" ? "/portfolio/icons/dark/closedark.svg" : "/portfolio/icons/light/close.svg"}
                                alt="close navigation"
                                width={35}
                                height={35}
                                className="max-w-[40px]"
                            />
                        </button>
                    </div>
                </div>

                <div className="flex flex-grow justify-end items-center pe-8 pb-[68.38px]">
                    <ul className="flex flex-col space-y-3 text-xl text-right">

                        <li>
                            <UnderlinedLink href="/#home" onClick={toggleNav}>
                                home
                            </UnderlinedLink>
                        </li>
                        <li>
                            <UnderlinedLink href="/portfolio/#recents" onClick={toggleNav} isVisible={isRecentsInView}>
                                recents
                            </UnderlinedLink>
                        </li>
                        <li>
                            <UnderlinedLink href="/gallery" onClick={toggleNav}>
                                gallery
                            </UnderlinedLink>
                        </li>
                        <li>
                            <UnderlinedLink href="/#intro" onClick={toggleNav} isVisible={isIntroInView}>
                                intro
                            </UnderlinedLink>
                        </li>
                        <li>
                            <UnderlinedLink href="/about" onClick={toggleNav}>
                                about
                            </UnderlinedLink>
                        </li>
                        <li>
                            <UnderlinedLink href="/#contact" scroll={true} isVisible={isContactInView} onClick={toggleNav} toggleNav={toggleNav}>
                                contact
                            </UnderlinedLink>
                        </li>

                    </ul>
                </div>

                <div
                    className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-5 py-3 bg-transparent">
                    <div className="flex-grow flex justify-start">
                        <LocalTime/>
                    </div>
                    <div className="flex-grow flex justify-end">
                        <SocialIcons />
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

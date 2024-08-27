import { LogoButton } from "@/components/logobutton";
import { LocalTime } from "@/components/footer/localtime";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

export const Footer = () => {

    const { theme } = useTheme();

    return (
        <div>
            <div className="flex justify-between items-center min-h-15dvh lg:px-7 lg:min-h-25dvh p-4 text-xs lg:text-sm xl:text-md">

                <div className="flex flex-row items-center justify-start space-x-5 min-h-full">

                    <div className="space-x-0">

                        <div className="hidden lg:block"><LogoButton size="medium"/></div>

                        <div className="lg:hidden h-[80%] w-auto">
                            <Link href="/portfolio/public#home">
                                <Image
                                src={theme === "dark" ? "/icons/dark/logodark.svg" : "/icons/light/logo.svg"}
                                alt={"logo"}
                                width={200}
                                height={200}
                                />
                            </Link>
                        </div>

                    </div>

                    <div className="flex flex-col justify-between space-y-5 h-full">

                        <div className={"space-y-2"}>
                            <div>
                                artwork and website by
                                <br/>
                                Fasai Charoensudjai
                            </div>

                            <div>
                                © 2024 - all rights
                                <br/>
                                reserved
                            </div>
                        </div>

                        <div className="self-start">
                            <LocalTime/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between space-y-4 h-full">
                    <div> [ my socials ]</div>
                    <ul className="flex flex-col space-y-1">
                        <li><a href={"#"}>linkedin</a></li>
                        <li><a href={"#"}>instagram</a></li>
                        <li><a href={"#"}>artstation</a></li>
                        <li><a href={"#"}>youtube</a></li>
                    </ul>
                </div>

            </div>

        </div>

    );
};

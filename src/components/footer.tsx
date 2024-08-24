import { LogoButton } from "@/components/logobutton";
import { LocalTime } from "@/components/localtime";

export const Footer = () => {
    return (
        <div>
            <div className="flex justify-between items-center p-4 text-xs sm:text-sm lg:text-md">

                <div
                    className="flex flex-row items-center justify-between space-x-3 md:space-x-4 lg:space-x-6 min-h-full">
                    <LogoButton size="medium"/>

                    <div className="flex flex-col justify-between space-y-6 h-full">

                        <div className={"space-y-2"}>
                            <div>
                                artwork and website by
                                <br/>
                                Fasai Charoensudjai
                            </div>

                            <div>
                                © 2024 - all rights reserved
                            </div>
                        </div>

                        <div className="self-start">
                            <LocalTime/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between h-full space-y-1">
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

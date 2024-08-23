import { LogoButton } from "@/components/logobutton";
import { LocalTime } from "@/components/localtime";

export const Footer = () => {
    return (
        <div className="flex justify-between items-center">

            <div className="flex flex-col justify-between">
                <div>
                    artwork and website by Fasai

                    <br/>

                    Charoensudjai

                    <br/>
                    <br/>

                    © 2024 - all rights reserved
                </div>
            </div>

            <div className={"space-y-3"}>
                <div> [ my socials ]</div>
                <ul className={"flex flex-col space-y-2"}>
                    <li><a href={"#"}> linkedin </a></li>
                    <li><a href={"#"}> instagram</a></li>
                    <li><a href={"#"}> artstation </a></li>
                    <li><a href={"#"}> youtube </a></li>
                </ul>
            </div>


        </div>
    )
}
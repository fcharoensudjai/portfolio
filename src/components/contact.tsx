import Link from "next/link";
import {Title} from "@/components/title";
import {Textbox} from "@/components/textbox";

export const Contact = () => {
    return (
        <div id="contact" className="flex flex-grow flex-col min-h-50dvh">

            <div className={"flex flex-grow justify-center items-center w-full"}>
                <Title size="large">
                    get in touch!
                </Title>
            </div>

            <div className="flex justify-end items-center px-3 md:px-5">
                <Textbox>
                    [ mail | fuzz.ch04@gmail.com ]
                </Textbox>
            </div>
        </div>
    )
}
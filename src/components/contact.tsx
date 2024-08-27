import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/scrambler";

export const Contact = () => {
    return (
        <div className="flex flex-grow flex-col min-h-[100dvh] scroll-mt-[75.58px] xl:scroll-mt-[103.22px]">

            <div id="contact" className={"flex flex-grow justify-center items-center w-full"}>
                <Title size="large">
                    get in touch!
                </Title>
            </div>

            <div className="flex justify-end items-center p-3 md:p-5">
                <Textbox>
                    <Scramble>[ mail | fuzz.ch04@gmail.com ] </Scramble>
                </Textbox>
            </div>
        </div>
    )
}
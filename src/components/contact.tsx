import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";

export const Contact = () => {
    return (
        <div id="contact" className="flex justify-center flex-col min-h-[50dvh] scroll-mt-[75.58px] xl:scroll-mt-[103.22px]">

            <div className={"flex flex-grow justify-center items-center w-full"}>
                <Title size="large">
                    get in touch!
                </Title>
            </div>

            <div className="flex justify-end items-center p-3 md:p-5">
                <Textbox>
                    <Scramble delay={2000} hover={true} interval={20}> [ mail | fuzz.ch04@gmail.com ] </Scramble>
                </Textbox>
            </div>
        </div>
    )
}
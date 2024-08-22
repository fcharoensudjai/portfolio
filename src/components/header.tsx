import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

export const Header = () => {
    return (
        <header>
            <div className="flex items-center justify-between px-2 py-1">
                <Link href="/">
                    <Image
                        src="/icons/logo.svg"
                        alt="logo"
                        width={222.47}
                        height={77.63}
                        layout="responsive"
                        className= "max-w-[150px] sm:max-w-[143px] lg:max-w-[222.47px]"
                    />
                </Link>

                <nav>
                    <ul className = "flex">
                        <li>
                            <Link href="#"> gallery </Link>
                        </li>
                        <li>
                            <Link href="#"> about </Link>
                        </li>
                        <li>
                            <Link href="#"> contact </Link>
                        </li>
                    </ul>
                </nav>
            </div>

        </header>
    )
}
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-0">
            <div className="flex items-center justify-between px-2 py-1">
                <Link href="/">
                    <Image
                        src="/icons/logo.svg"
                        alt="logo"
                        width={222.47}
                        height={77.63}
                        layout="responsive"
                        className= "max-w-[143px] md:max-w-[143px] lg:max-w-[222.47px]"
                    />
                </Link>

                <nav>
                    <ul className = "flex [&_a]:text-sm sm:[&_a]:text-md space-x-1 sm:space-x-3">
                        <li>
                            <Link href="/gallery"> gallery </Link>
                        </li>
                        <li>
                            <Link href="/about"> about </Link>
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
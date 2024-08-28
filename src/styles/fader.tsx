import { ReactNode, CSSProperties } from "react";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface FaderProps {
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
}

function Fader({ children, style = {}, className = "" }: FaderProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div
            ref={ref}
            style={{
                opacity: isInView ? 1 : 0,
                transition: "all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
                ...style
            }}
            className={className}
        >
            {children}
        </div>
    );
}

export default Fader;

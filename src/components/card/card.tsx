import Image from 'next/image';
import { useRef } from 'react';
import Fader from "@/components/stylers/fader";

interface CardProps {
    src: string;
    alt: string;
}

export const Card: React.FC<CardProps> = ({ src, alt }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div>
            <Fader threshold={0.35}>
                <div ref={cardRef} className="card relative">
                    <Image
                        src={src}
                        alt={alt}
                        width={5000}
                        height={5000}
                        style={{objectFit: "cover"}}
                    />
                </div>
            </Fader>
        </div>
    );
};

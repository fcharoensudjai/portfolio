import React from "react";
import { cva } from "class-variance-authority"

interface DottedLineSeparatorProps {
    children: React.ReactNode;
}

export const DottedLineSeparator: React.FC<DottedLineSeparatorProps> = ({ children }) => {
    return (
        <div className="lg:hidden flex items-center space-x-2">
            <div>{children}</div>
            <div className="flex-grow">
                <div
                    style={{
                        height: '0.5em',
                        backgroundImage: 'linear-gradient(to right, currentColor 50%, transparent 50%)',
                        backgroundSize: '15px 1px',
                        backgroundRepeat: 'repeat-x',
                        transform: 'translateY(0.225em)', // Adjust alignment as needed
                    }}
                />
            </div>
        </div>
    );
};
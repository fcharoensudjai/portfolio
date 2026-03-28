"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ExitAnimationContextType {
    isExit: boolean;
    setIsExit: (isExit: boolean) => void;
}

const ExitAnimationContext = createContext<ExitAnimationContextType | undefined>(undefined);

export const useExitAnimation = () => {
    const context = useContext(ExitAnimationContext);
    if (!context) {
        throw new Error("useExitAnimation must be used within an ExitAnimationProvider");
    }
    return context;
};

export const ExitAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isExit, setIsExit] = useState(false);
    return (
        <ExitAnimationContext.Provider value={{ isExit, setIsExit }}>
            {children}
        </ExitAnimationContext.Provider>
    );
};

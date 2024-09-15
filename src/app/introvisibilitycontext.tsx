"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VisibilityContextType {
    isIntroInView: boolean;
    setIsIntroInView: (inView: boolean) => void;
    resetIntroVisibility: () => void;
}

const Introvisibilitycontext = createContext<VisibilityContextType | undefined>(undefined);

export const VisibilityProvider2: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isIntroInView, setIsIntroInView] = useState<boolean>(false);

    const resetIntroVisibility = () => setIsIntroInView(false);

    return (
        <Introvisibilitycontext.Provider value={{ isIntroInView, setIsIntroInView, resetIntroVisibility }}>
            {children}
        </Introvisibilitycontext.Provider>
    );
};

export const useVisibility2 = () => {
    const context = useContext(Introvisibilitycontext);
    if (!context) {
        throw new Error('useVisibility must be used within a VisibilityProvider');
    }
    return context;
};

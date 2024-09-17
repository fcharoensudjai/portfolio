"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VisibilityContextType {
    isContactInView: boolean;
    setIsContactInView: (inView: boolean) => void;
    resetContactVisibility: () => void;
}

const Contactvisibilitycontext = createContext<VisibilityContextType | undefined>(undefined);

export const VisibilityProvider3: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isContactInView, setIsContactInView] = useState<boolean>(false);

    const resetContactVisibility = () => setIsContactInView(false);

    return (
        <Contactvisibilitycontext.Provider value={{ isContactInView, setIsContactInView, resetContactVisibility}}>
            {children}
        </Contactvisibilitycontext.Provider>
    );
};

export const useVisibility3 = () => {
    const context = useContext(Contactvisibilitycontext);
    if (!context) {
        throw new Error('useVisibility must be used within a VisibilityProvider');
    }
    return context;
};

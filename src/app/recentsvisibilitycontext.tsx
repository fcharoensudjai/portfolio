"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VisibilityContextType {
    isRecentsInView: boolean;
    setIsRecentsInView: (inView: boolean) => void;
    resetRecentsVisibility: () => void;
}

const Recentsvisibilitycontext = createContext<VisibilityContextType | undefined>(undefined);

export const VisibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isRecentsInView, setIsRecentsInView] = useState<boolean>(false);

    const resetRecentsVisibility = () => setIsRecentsInView(false);

    return (
        <Recentsvisibilitycontext.Provider value={{ isRecentsInView, setIsRecentsInView, resetRecentsVisibility}}>
            {children}
        </Recentsvisibilitycontext.Provider>
    );
};

export const useVisibility = () => {
    const context = useContext(Recentsvisibilitycontext);
    if (!context) {
        throw new Error('useVisibility must be used within a VisibilityProvider');
    }
    return context;
};

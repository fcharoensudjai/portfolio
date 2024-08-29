"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const Highlighter = () => {
    const { theme } = useTheme();

    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'selection-styles';
        document.head.appendChild(style);

        const updateHighlighter = (theme: string | undefined) => {
            const selectionColor = theme === 'dark' ? '#403B3B' : '#E8E7E2';
            const textColor = theme === 'dark' ? '#E8E7E2' : '#242424';

            style.innerHTML = `
                ::selection {
                    background: ${selectionColor};
                    color: ${textColor};
                }
                ::-moz-selection {
                    background: ${selectionColor};
                    color: ${textColor};
                }
            `;
        };

        updateHighlighter(theme);

        return () => {
            document.head.removeChild(style);
        };
    }, [theme]);

    return null;
};

export default Highlighter;

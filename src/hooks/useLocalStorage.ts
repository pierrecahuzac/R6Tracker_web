import { useState, useEffect } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                return JSON.parse(saved) as T;
            } catch (e) {
                console.error(`Erreur de parsing localStorage pour la clé ${key}:`, e);
               
                return defaultValue; 
            }
        }
    }
    return defaultValue;
}

export const useLocalStorage = <T,>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T>(() => {
     
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
          
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue] as const;
};
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { LocalStorage } from "../lib/LocalStorage";


export interface UserPreferences {
    theme: 'light' | 'dark';
}

const DEFAULT_PREFERENCES = { theme: 'light' as const };

interface ContextValue {
    preferences: UserPreferences;
    setPreferences: (preferences: Partial<UserPreferences>) => void;
    clearPreferences: () => void;
}

const Context = createContext<ContextValue | undefined>(undefined);

const storage = new LocalStorage<UserPreferences>('preferences');

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
    const [preferences, _setPreferences] = useState<UserPreferences>(() => {
        return storage.get() ?? DEFAULT_PREFERENCES;
    });

    useEffect(() => {
        document.body.classList.remove('light');
        document.body.classList.remove('dark');
        document.body.classList.add(preferences.theme);
    }, [preferences.theme]);

    function clearPreferences() {
        storage.clear();
        _setPreferences(DEFAULT_PREFERENCES);
    }

    function setPreferences(updates: Partial<UserPreferences>) {
        const newPreferences = { ...preferences, ...updates };

        storage.set(newPreferences);
        _setPreferences(newPreferences);
    }
    return (
        <Context.Provider value={{ preferences, setPreferences, clearPreferences }}>{children}</Context.Provider>
    );
}

export function useUserPreferences() {
    const context = useContext(Context);
    if (!context) {
        throw new Error('Cannot use useUserPreferences outside of UserPreferencesProvider');
    }

    return context;
}

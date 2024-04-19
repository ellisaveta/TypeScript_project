import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { UserInfo, userInfoStorage } from "../services/userInfoStorage";

const CurrentUserContext = createContext<UserInfo | undefined>(undefined)

export function CurrentUserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserInfo | undefined>(userInfoStorage.userInfo);

    useEffect(() => {
        userInfoStorage.setHandler(setUser);
        return () => {
            userInfoStorage.setHandler(undefined);
        };
    }, []);

    return (
        <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>
    );
}

export function useCurrentUser() {
    return useContext(CurrentUserContext);
}

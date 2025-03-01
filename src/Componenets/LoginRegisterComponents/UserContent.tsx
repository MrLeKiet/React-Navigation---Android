import React, { createContext, useState, ReactNode } from "react";

interface IGetUserId {
    getUserId: string | null;
    setGetUserId: (getUserId: string) => void;
}

const defaultValue: IGetUserId = {
    getUserId: "",
    setGetUserId: () => { },
};

const UserType = createContext(defaultValue);

const UserContext = ({ children }: { children: ReactNode }) => {
    const [getUserId, setGetUserId] = useState<string | null>("");

    return (
        <UserType.Provider value={{ getUserId, setGetUserId }}>
            {children}
        </UserType.Provider>
    );
};

export { UserType, UserContext };

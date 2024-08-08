import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { v4 as uuidV4 } from "uuid";

interface UserP {
  userId: string;
  userName: string;
  setUserName: (useName: string) => void;
}

export const UserContext = createContext<UserP>({
  userId: "",
  userName: "",
  setUserName: (userName: string) => {},
});

interface UserProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProps> = ({ children }) => {
  const [userId] = useState(localStorage.getItem("userId") || uuidV4());

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);
  return (
    <UserContext.Provider value={{ userId, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};
